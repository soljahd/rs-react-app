import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFormStore } from '../store/formStore';
import { countries as allCountries } from '../utils/countries';

describe('useFormStore', () => {
  beforeEach(() => {
    const state = useFormStore.getState();
    state.controlledForms.length = 0;
    state.uncontrolledForms.length = 0;
    state.countries.length = 0;
    vi.useFakeTimers();
  });

  it('should add controlled form and reset _new after 2.5s', () => {
    const data = {
      name: 'John',
      age: '30',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as 'male' | 'female',
      country: 'USA',
      terms: true,
      image: 'base64string',
    };

    useFormStore.getState().addControlledForm(data);

    let state = useFormStore.getState();
    expect(state.controlledForms).toHaveLength(1);
    expect(state.controlledForms[0]._new).toBe(true);

    vi.advanceTimersByTime(2500);

    state = useFormStore.getState();
    expect(state.controlledForms[0]._new).toBe(false);
  });

  it('should add uncontrolled form and reset _new after 2.5s', () => {
    const data = {
      name: 'John',
      age: '30',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as 'male' | 'female',
      country: 'USA',
      terms: true,
      image: 'base64string',
    };

    useFormStore.getState().addUncontrolledForm(data);

    let state = useFormStore.getState();
    expect(state.uncontrolledForms).toHaveLength(1);
    expect(state.uncontrolledForms[0]._new).toBe(true);

    vi.advanceTimersByTime(2500);

    state = useFormStore.getState();
    expect(state.uncontrolledForms[0]._new).toBe(false);
  });

  it('should hydrate countries', () => {
    expect(useFormStore.getState().countries).toHaveLength(0);
    useFormStore.getState().hydrateCountries();
    expect(useFormStore.getState().countries).toEqual(allCountries);
  });
});
