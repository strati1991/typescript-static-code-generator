export class TransformTestClass {
  constructor() {
    console.log('test');
  }
  protected static testProtectedStatic1({params}: {params: string}): string {
    return params;
  }

  protected static testProtectedStatic2(params: {
    params: string;
  }): {params: string} {
    return params;
  }

  protected static testProtectedStatic3(params: string): string {
    return params;
  }

  public static testPublicStatic1({params}: {params: string}): string {
    return params;
  }

  public static testPublicStatic2(params: {params: string}): {params: string} {
    return params;
  }

  public static testPublicStatic3(params: string): string {
    return params;
  }

  static testStatic1({params}: {params: string}): string {
    return params;
  }

  static testStatic2(params: {params: string}): {params: string} {
    return params;
  }

  static testStatic3(params: string): string {
    return params;
  }

  protected static async testProtectedStaticAsync1({
    params,
  }: {
    params: string;
  }): Promise<string> {
    return params;
  }

  protected static async testProtectedStaticAsync2(params: {params: string}): Promise<
    {
      params: string;
    }
  > {
    return params;
  }

  protected static async testProtectedStaticAsync3(
    params: string
  ): Promise<string> {
    return params;
  }

  public static async testPublicStaticAsync1({
    params,
  }: {
    params: string;
  }): Promise<string> {
    return params;
  }

  public static async testPublicStaticAsync2(params: {params: string}): Promise<
    {
      params: string;
    }
  > {
    return params;
  }

  public static async testPublicStaticAsync3(params: string): Promise<string> {
    return params;
  }

  static async testStaticAsync1({params}: {params: string}): Promise<string> {
    return params;
  }

  static async testStaticAsync2(params: {
    params: string;
  }): Promise<{params: string}> {
    return params;
  }

  static async testStaticAsync3(params: string): Promise<string> {
    return params;
  }

  protected async testProtectedAsync1({
    params,
  }: {
    params: string;
  }): Promise<string> {
    return params;
  }

  protected async testProtectedAsync2(params: {
    params: string;
  }): Promise<{params: string}> {
    return params;
  }

  protected async testProtectedAsync3(params: string): Promise<string> {
    return params;
  }

  public async testPublicAsync1({params}: {params: string}): Promise<string> {
    return params;
  }

  public async testPublicAsync2(params: {
    params: string;
  }): Promise<{params: string}> {
    return params;
  }

  public async testPublicAsync3(params: string): Promise<string> {
    return params;
  }

  async testAsync1({params}: {params: string}): Promise<string> {
    return params;
  }

  async testAsync2(params: {params: string}): Promise<{params: string}> {
    return params;
  }

  async testAsync3(params: string): Promise<string> {
    return params;
  }

  complexParams({
    params,
    id,
  }: {
    params: string;
    id: string;
  }): {params: string; id: string} {
    return {params, id};
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
