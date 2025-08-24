import { create } from 'zustand';
import { countries as allCountries } from '../utils/countries';
import type { FormSchema } from '../schemas/formSchema';

type Store = {
  controlledForms: (FormSchema & { _new?: boolean })[];
  uncontrolledForms: (FormSchema & { _new?: boolean })[];
  countries: string[];
  addControlledForm: (data: FormSchema) => void;
  addUncontrolledForm: (data: FormSchema) => void;
  hydrateCountries: () => void;
};

export const useFormStore = create<Store>((set) => ({
  controlledForms: [],
  uncontrolledForms: [],
  countries: [],
  addControlledForm: (data) => {
    set((s) => ({
      controlledForms: [...s.controlledForms, { ...data, _new: true }],
    }));
    setTimeout(() => {
      set((s) => ({
        controlledForms: s.controlledForms.map((x) => ({ ...x, _new: false })),
      }));
    }, 2500);
  },
  addUncontrolledForm: (data) => {
    set((s) => ({
      uncontrolledForms: [...s.uncontrolledForms, { ...data, _new: true }],
    }));
    setTimeout(() => {
      set((s) => ({
        uncontrolledForms: s.uncontrolledForms.map((x) => ({ ...x, _new: false })),
      }));
    }, 2500);
  },
  hydrateCountries: () => {
    set({ countries: allCountries });
  },
}));
