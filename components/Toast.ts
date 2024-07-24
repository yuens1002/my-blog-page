'use client';

import { useToast } from '@/components/ui/use-toast';

type ToastParamType = {
  variant?: 'default' | 'destructive' | null | undefined;
  message: string;
};

export default function Toast({ variant, message }: ToastParamType) {
  const { toast } = useToast();
  toast({
    variant,
    title: message,
  });
}
