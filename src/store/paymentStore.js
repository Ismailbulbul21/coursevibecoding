import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const usePaymentStore = create((set) => ({
    payments: [],
    userPayments: [],
    isLoading: false,
    error: null,

    createPayment: async (courseId, amount, paymentMethod, paymentReference) => {
        set({ isLoading: true, error: null });
        try {
            const user = await supabase.auth.getUser();

            if (!user.data?.user) {
                throw new Error('User must be logged in to make a payment');
            }

            const { data, error } = await supabase
                .from('payments')
                .insert({
                    user_id: user.data.user.id,
                    course_id: courseId,
                    amount,
                    payment_method: paymentMethod,
                    payment_reference: paymentReference,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            set({ isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { error };
        }
    },

    fetchUserPayments: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await supabase.auth.getUser();

            if (!user.data?.user) {
                throw new Error('User must be logged in to view payments');
            }

            const { data, error } = await supabase
                .from('payments')
                .select(`
          *,
          courses:course_id (
            title,
            price
          )
        `)
                .eq('user_id', user.data.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ userPayments: data, isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return [];
        }
    },

    fetchAllPayments: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('payments')
                .select(`
          *,
          profiles:user_id (
            email,
            full_name
          ),
          courses:course_id (
            title,
            price
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ payments: data, isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return [];
        }
    },

    updatePaymentStatus: async (paymentId, status, notes = '') => {
        set({ isLoading: true, error: null });
        try {
            console.log(`Updating payment ${paymentId} status to ${status}`);
            
            const { data, error } = await supabase
                .from('payments')
                .update({
                    status,
                    verification_notes: notes,
                    updated_at: new Date()
                })
                .eq('id', paymentId)
                .select()
                .single();

            if (error) {
                console.error('Error updating payment status:', error);
                throw error;
            }

            console.log('Payment updated successfully:', data);

            // If payment is verified, create enrollment
            if (status === 'verified') {
                console.log(`Creating enrollment for user ${data.user_id} in course ${data.course_id}`);
                
                // First check if enrollment already exists
                const { data: existingEnrollment, error: checkError } = await supabase
                    .from('enrollments')
                    .select('*')
                    .eq('user_id', data.user_id)
                    .eq('course_id', data.course_id)
                    .single();
                
                if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
                    console.error('Error checking existing enrollment:', checkError);
                }
                
                if (existingEnrollment) {
                    console.log('Enrollment already exists, ensuring it is active');
                    // If enrollment exists but is not active, activate it
                    if (!existingEnrollment.is_active) {
                        const { error: updateError } = await supabase
                            .from('enrollments')
                            .update({ is_active: true, updated_at: new Date() })
                            .eq('id', existingEnrollment.id);
                        
                        if (updateError) {
                            console.error('Error activating existing enrollment:', updateError);
                        } else {
                            console.log('Existing enrollment activated');
                        }
                    }
                } else {
                    // Create new enrollment
                    console.log('Creating new enrollment');
                    const { data: enrollment, error: enrollmentError } = await supabase
                        .from('enrollments')
                        .insert({
                            user_id: data.user_id,
                            course_id: data.course_id,
                            is_active: true
                        })
                        .select()
                        .single();

                    if (enrollmentError) {
                        console.error('Error creating enrollment:', enrollmentError);
                        throw enrollmentError;
                    }
                    
                    console.log('Enrollment created successfully:', enrollment);
                }
            }

            set({ isLoading: false });
            return data;
        } catch (error) {
            console.error('Exception in updatePaymentStatus:', error);
            set({ error: error.message, isLoading: false });
            return { error };
        }
    },
})); 