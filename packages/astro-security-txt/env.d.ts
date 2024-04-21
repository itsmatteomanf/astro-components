/// <reference types="astro/client" />

type SecurityTxtOptions = {
	contact: string | string[]
	expires?: Date | undefined
	encryption?: string | string[] | undefined
	acknowledgements?: string | string[] | undefined
	preferredLanguages?: string | string[] | undefined
	canonical?: string | string[] | undefined
	policy?: string | string[] | undefined
	hiring?: string | string[] | undefined
	csaf?: string | string[] | undefined
};