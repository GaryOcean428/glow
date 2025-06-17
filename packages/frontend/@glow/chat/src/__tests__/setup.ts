import '@testing-library/jest-dom';
import { configure } from '@testing-library/vue';

expect.extend({
	toBeVisible(element: HTMLElement) {
		const style = window.getComputedStyle(element);
		const pass =
			!!(
				element &&
				(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
			) &&
			style.visibility !== 'hidden' &&
			style.display !== 'none';

		return {
			pass,
			message: () => `expected element ${pass ? 'not ' : ''}to be visible`,
		};
	},
	toBeInTheDocument(element: HTMLElement) {
		const pass = document.body.contains(element);
		return {
			pass,
			message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
		};
	},
	toBeDisabled(element: HTMLElement) {
		const pass = (element as HTMLButtonElement).disabled === true;
		return {
			pass,
			message: () => `expected element ${pass ? 'not ' : ''}to be disabled`,
		};
	},
	toHaveTextContent(element: HTMLElement, text: string) {
		const pass = element.textContent?.includes(text) ?? false;
		return {
			pass,
			message: () => `expected element ${pass ? 'not ' : ''}to have text content '${text}'`,
		};
	},
});

configure({ testIdAttribute: 'data-test-id' });

window.ResizeObserver =
	window.ResizeObserver ||
	vi.fn().mockImplementation(() => ({
		disconnect: vi.fn(),
		observe: vi.fn(),
		unobserve: vi.fn(),
	}));
