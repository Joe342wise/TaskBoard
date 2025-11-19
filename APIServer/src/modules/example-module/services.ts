import { Result } from "@/lib/response";

export async function someCoolService(data: string): Promise<Result<string>> {
  // Implement your service logic here
  return { ok: true, value: `Processed: ${data}` };
}

const exampleService = {
  someCoolService,
};
export default exampleService;
