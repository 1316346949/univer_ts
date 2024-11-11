import { Disposable, ICommandService } from "@univerjs/core";
import { ClickOperation } from "../commands/my-command";

export class ClickCommand extends Disposable {
  constructor(
    @ICommandService private readonly _commandService: ICommandService
  ) {
    super();
    //注册点击事件
    this.disposeWithMe(this._commandService.registerCommand(ClickOperation));
  }
}
