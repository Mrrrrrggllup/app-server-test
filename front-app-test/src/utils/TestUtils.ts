import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/react';

export function ignoreMuiWarningAboutAutompleteEmptyValue() {
    const warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation((...args) => {
      const [message] = args;
      if (message.includes('MUI: The value provided to Autocomplete is invalid')) {
        return; // Ignorer le warning spécifique
      }
  
      // Sinon, afficher les autres warnings
      console.warn(...args);
    });
  }
  
  export function switchAutocompleteValue(autocomplete: HTMLElement, value: string) {
    userEvent.type(autocomplete, value);
    const valueRegex = new RegExp(value, 'i');
    userEvent.click(screen.getByText(valueRegex)); 
  }