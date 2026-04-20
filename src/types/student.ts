export interface Student {
    userId: string;
    name: string;
    dob: Date; 
    address: string;
    phone: string;
    gender: string;    
    avatarUrl: string; 
}

export interface StudentState {
    loading: boolean;
    student: Student | null;
    
    // Actions
    setStudent: (student: Student) => void;
    setLoading: (status: boolean) => void;
}