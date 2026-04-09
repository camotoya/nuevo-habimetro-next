'use client';
import { useState, useCallback } from 'react';
import type { FormData, ApiState } from '@/types';

const initialFormData: FormData = {
  propertyType: 1, city: '', cityName: '', cityId: '',
  tipoVia: '', num1: '', num2: '', num3: '', address: '',
  unit: '', area: 0, rooms: 3, bathrooms: 2, garages: 1,
  age: 0, stratum: 4, elevator: 1, balcony: 0, terrace: 0,
  storage: 0, doorman: 0, remodeled: 0, floor: 3, view: 'Interna',
  name: '', email: '', phone: '', intent: 'vender',
};

const initialApiState: ApiState = {
  cities: [], georef: null, catastral: null, daneCode: null,
  pois: null, medianZone: null, discarded: null,
  postResult: null, habimetro: null,
};

export function useFormState() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [apiState, setApiState] = useState<ApiState>(initialApiState);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [showResults, setShowResults] = useState(false);

  const updateForm = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      // Auto-build address from structured fields
      if (updates.tipoVia !== undefined || updates.num1 !== undefined || updates.num2 !== undefined || updates.num3 !== undefined) {
        const via = updates.tipoVia ?? prev.tipoVia;
        const n1 = updates.num1 ?? prev.num1;
        const n2 = updates.num2 ?? prev.num2;
        const n3 = updates.num3 ?? prev.num3;
        next.address = (via && n1 && n2 && n3) ? `${via} ${n1} # ${n2} - ${n3}` : '';
      }
      return next;
    });
  }, []);

  const updateApi = useCallback((updates: Partial<ApiState>) => {
    setApiState(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setApiState(initialApiState);
    setCurrentStep(1);
    setShowResults(false);
    setLoading(false);
  }, []);

  return {
    formData, updateForm,
    apiState, updateApi,
    currentStep, setCurrentStep,
    loading, setLoading,
    loadingMsg, setLoadingMsg,
    showResults, setShowResults,
    reset,
  };
}
