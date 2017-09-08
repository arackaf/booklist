declare module "reselect" {
  namespace Reselect {
    type Selector<TInput, TOutput> = (state: TInput, props?: any) => TOutput;
    function createSelector<TInput, TOutput, T1>(selector1: Selector<TInput, T1>, combiner: (arg1: T1) => TOutput): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      combiner: (arg1: T1, arg2: T2) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      combiner: (arg1: T1, arg2: T2, arg3: T3) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6, T7>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      selector7: Selector<TInput, T7>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6, T7, T8>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      selector7: Selector<TInput, T7>,
      selector8: Selector<TInput, T8>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      selector7: Selector<TInput, T7>,
      selector8: Selector<TInput, T8>,
      selector9: Selector<TInput, T9>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      selector7: Selector<TInput, T7>,
      selector8: Selector<TInput, T8>,
      selector9: Selector<TInput, T9>,
      selector10: Selector<TInput, T10>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10) => TOutput
    ): Selector<TInput, TOutput>;
    function createSelector<TInput, TOutput, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
      selector1: Selector<TInput, T1>,
      selector2: Selector<TInput, T2>,
      selector3: Selector<TInput, T3>,
      selector4: Selector<TInput, T4>,
      selector5: Selector<TInput, T5>,
      selector6: Selector<TInput, T6>,
      selector7: Selector<TInput, T7>,
      selector8: Selector<TInput, T8>,
      selector9: Selector<TInput, T9>,
      selector10: Selector<TInput, T10>,
      selector11: Selector<TInput, T11>,
      combiner: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, arg11: T11) => TOutput
    ): Selector<TInput, TOutput>;

    function defaultMemoize(func: Function, equalityCheck: any): any;

    function createSelectorCreator(memoize: Function, ...memoizeOptions: any[]): any;

    function createStructuredSelector(inputSelectors: any, selectorCreator: any): any;
  }
  export = Reselect;
}
