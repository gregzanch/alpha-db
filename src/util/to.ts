export async function to(promise: Promise<any>) {
	try {
    const data = await promise;
    return [null, data];
  }
  catch (err) {
    return [err];
  }
}

export default to;