import { preparePlatformSetup } from './prepareSetup';

type FormHookTestFormApi = {
  handleSubmit: () => Promise<void> | void;
};

type FormHookResult = {
  form: FormHookTestFormApi;
};

type PrepareFormHookTestSetupArgs<HookProps extends object> = {
  hookProps: HookProps;
  useFormHook: (hookProps: HookProps) => FormHookResult;
};

const PrepareFormHookTestSetup = <HookProps extends object>({
  hookProps,
  useFormHook,
}: PrepareFormHookTestSetupArgs<HookProps>) => {
  const { form } = useFormHook(hookProps);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <button type="submit">Submit</button>
    </form>
  );
};

export const prepareFormHookTestSetup = <HookProps extends object>({
  hookProps,
  useFormHook,
}: PrepareFormHookTestSetupArgs<HookProps>) =>
  preparePlatformSetup<PrepareFormHookTestSetupArgs<HookProps>>({
    component: PrepareFormHookTestSetup,
    props: {
      hookProps,
      useFormHook,
    },
  });
