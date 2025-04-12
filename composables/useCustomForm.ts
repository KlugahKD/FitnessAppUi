import { computed } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type {
  InvalidSubmissionHandler,
  MaybePromise,
  SubmissionHandler,
} from "vee-validate";
import type { input, output, ZodSchema } from "zod";

type UseFormOptions = Parameters<typeof useForm>[0];

// this is similar to the vee-validate `HandleSubmitFactory` type, but that type is not exported
type SubmitHandler<T extends ZodSchema> = (
  cb: SubmissionHandler<output<T>, output<T>, Promise<void>>,
  onSubmitValidationErrorCb?: InvalidSubmissionHandler<output<T>, output<T>>
) => (e?: Event) => MaybePromise<any>;

export function useCustomForm<T extends ZodSchema>(
  zodSchema: T,
  opts?: UseFormOptions
) {
  const form = useForm({
    validationSchema: toTypedSchema(zodSchema),
    ...(opts ?? {}),
  });

  const isValidForm = computed(() => {
    return zodSchema.safeParse(form.values).success;
  });

  const issues = computed(() => {
    const zodIssues = zodSchema.safeParse(form.values).error?.issues ?? [];
    return zodIssues.reduce((acc, curr) => {
      const key = curr.path.join(".");
      return { ...acc, [key]: curr.message };
    }, {} as Record<string, string>);
  });

  provide("form-issues", issues);

  return {
    ...form,
    values: form.values as input<T>,
    handleSubmit: form.handleSubmit as SubmitHandler<T>,
    isValidForm,
    issues,
  };
}
