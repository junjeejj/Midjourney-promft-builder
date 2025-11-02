export const supabase: any = {
  auth: {
    // demo stub: pretend session is empty
    getSession: async () => ({ data: { session: null }, error: null }),

    // demo stub: no real OAuth yet
    signInWithOAuth: async () => ({ data: null, error: "not-implemented" }),

    // demo stub: signOut does nothing
    signOut: async () => ({ error: null }),

    // demo stub: signInWithPassword
    signInWithPassword: async () => ({ data: null, error: "not-implemented" }),

    // demo stub: signUp
    signUp: async () => ({ data: null, error: "not-implemented" }),

    // demo stub: onAuthStateChange
    onAuthStateChange: () => ({ data: { subscription: null }, error: null })
  }
};
