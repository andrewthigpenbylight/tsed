import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("haml")
export class HamlEngine extends Engine {
  protected $compile(template: string, options: any) {
    return (options: any) => {
      options.locals = options;
      return Promise.resolve(this.engine.render(template, options).trimLeft());
    };
  }
}
