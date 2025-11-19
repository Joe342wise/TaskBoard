export { };

declare module 'hono' {
    interface ContextVariableMap {
      // you can modify this
      jwtPayload: {
       userId:string,
       iat:number,
       exp:number
      }
    }
  }