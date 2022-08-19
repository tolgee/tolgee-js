import { Formatter, TolgeeModule } from '../types';

export class ModuleService {
  formatter: Formatter | null = null;

  addModule = (module: TolgeeModule) => {
    if (module.type === 'formatter') {
      const instance = new module();
      this.formatter = instance;
    } else {
      throw new Error('Module with unknown type');
    }
  };
}
