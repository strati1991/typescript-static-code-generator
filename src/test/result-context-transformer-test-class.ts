import {EmptyResult, Result, success} from '@utility/result';

type test = EmptyResult;
export default class ResultContextTransformTestClass {
  protected readonly test: EmptyResult;
  protected readonly test44: test;
  protected readonly test2 = /assaf/;
  protected readonly blub: string;
  constructor() {
    this.blub = 'asdasd';
    this.test = success();
    this.test44 = success();
  }
  protected static testProtectedStatic1({params}: {params: string}): Result<string> {
    return success(params);
  }

  protected static testProtectedStatic2(params: {
    params: string;
  }): Result<{params: string}> {
    return success(params);
  }

  protected static testProtectedStatic3(params: string): Result<string> {
    return success(params);
  }

  public static testPublicStatic1({params}: {params: string}): Result<string> {
    return success(params);
  }

  public static testPublicStatic2(params: {params: string}): Result<{params: string}> {
    return success(params);
  }

  public static testPublicStatic3(params: string): Result<string> {
    return success(params);
  }

  static testStatic1({params}: {params: string}): Result<string> {
    return success(params);
  }

  static testStatic2(params: {params: string}): Result<{params: string}> {
    return success(params);
  }

  static testStatic3(params: string): Result<string> {
    return success(params);
  }

  protected static async testProtectedStaticAsync1({
    params,
  }: {
    params: string;
  }): Promise<Result<string>> {
    return success(params);
  }

  protected static async testProtectedStaticAsync2(params: {params: string}): Promise<
    Result<{
      params: string;
    }>
  > {
    return success(params);
  }

  protected static async testProtectedStaticAsync3(
    params: string
  ): Promise<Result<string>> {
    return success(params);
  }

  public static async testPublicStaticAsync1({
    params,
  }: {
    params: string;
  }): Promise<Result<string>> {
    return success(params);
  }

  public static async testPublicStaticAsync2(params: {params: string}): Promise<
    Result<{
      params: string;
    }>
  > {
    return success(params);
  }

  public static async testPublicStaticAsync3(params: string): Promise<Result<string>> {
    return success(params);
  }

  static async testStaticAsync1({params}: {params: string}): Promise<Result<string>> {
    return success(params);
  }

  static async testStaticAsync2(params: {
    params: string;
  }): Promise<Result<{params: string}>> {
    return success(params);
  }

  static async testStaticAsync3(params: string): Promise<Result<string>> {
    return success(params);
  }

  protected async testProtectedAsync1({
    params,
  }: {
    params: string;
  }): Promise<Result<string>> {
    return success(params);
  }

  protected async testProtectedAsync2(params: {
    params: string;
  }): Promise<Result<{params: string}>> {
    return success(params);
  }

  protected async testProtectedAsync3(params: string): Promise<Result<string>> {
    return success(params);
  }

  public async testPublicAsync1({params}: {params: string}): Promise<Result<string>> {
    return success(params);
  }

  public async testPublicAsync2(params: {
    params: string;
  }): Promise<Result<{params: string}>> {
    return success(params);
  }

  public async testPublicAsync3(params: string): Promise<Result<string>> {
    return success(params);
  }

  async testAsync1({params}: {params: string}): Promise<Result<string>> {
    return success(params);
  }

  async testAsync2(params: {params: string}): Promise<Result<{params: string}>> {
    return success(params);
  }

  async testAsync3(params: string): Promise<Result<string>> {
    return success(params);
  }

  complexParams({
    params,
    id,
  }: {
    params: string;
    id: string;
  }): Result<{params: string; id: string}> {
    return success({params, id});
  }

  async testNotResult(params: string): Promise<ITestNotResult> {
    return {test: 'sdsd'};
  }

  async testNotResult1(params: string): Promise<string> {
    return 'sdsd';
  }

  testNotResult2(params: string) {
    return 'sdsd';
  }

  testNotResult3(params: string): string {
    return 'sdsd';
  }
}

interface ITestNotResult {
  test: string;
}
