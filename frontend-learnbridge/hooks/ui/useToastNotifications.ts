// hooks/useToastNotifications.ts
import { useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { Resource } from '@/interfaces/resource.interface';
import { Tutor } from '@/interfaces/tutor.interface';

interface UseToastNotificationsProps {
  loading: boolean;
  resources: Resource[];
  tutors: Tutor[];
}

export const useToastNotifications = ({
  loading,
  resources,
  tutors,
}: UseToastNotificationsProps) => {
  const { toast } = useToast();
  const hasShownToast = useRef({ resources: false, tutors: false });

  useEffect(() => {
    if (!loading) {
      if (resources.length === 0 && !hasShownToast.current.resources) {
        hasShownToast.current.resources = true;
        toast({
          title: "No resources found",
          description: "Check back later for study materials",
          variant: "default"
        });
      }
      
      if (tutors.length === 0 && !hasShownToast.current.tutors) {
        hasShownToast.current.tutors = true;
        toast({
          title: "No tutors available",
          description: "No tutors are currently registered",
          variant: "default"
        });
      }
    }
  }, [loading, resources.length, tutors.length]); // Removed toast from dependencies
};