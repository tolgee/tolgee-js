import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import {
	getFallback,
	type NsFallback,
	type TolgeeInstance,
	type TranslateProps
} from '@tolgee/web';
import { getTolgeeContext } from './getTolgeeContext';

const getTranslateInternal = (ns?: NsFallback) => {
	const namespaces = getFallback(ns);
	const tolgeeContext = getTolgeeContext();

	const tolgee = tolgeeContext?.tolgee as TolgeeInstance;

	if (!tolgee) {
		throw new Error('Tolgee instance not provided');
	}

	const tFunction = createTFunction();

	const t = writable(tFunction);

	const subscription = tolgee.on('update', () => {
		t.set(createTFunction());
		isLoading.set(!tolgee.isLoaded(namespaces));
	});

	tolgee.addActiveNs(namespaces);

	onDestroy(() => {
		subscription?.unsubscribe();
		tolgee.removeActiveNs(namespaces);
	});

	const isLoading = writable(!tolgee.isLoaded(namespaces));

	function createTFunction() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (props: TranslateProps<any>) => {
			const fallbackNs = props.ns ?? namespaces?.[0];
			return tolgee.t({ ...props, ns: fallbackNs });
		};
	}

	return {
		t: t,
		isLoading
	};
};

export default getTranslateInternal;
