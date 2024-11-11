import {
  Disposable,
  ICommandService,
  Inject,
  Injector,
  PermissionService,
} from "@univerjs/core";
import {
  ComponentManager,
  ContextMenuGroup,
  ContextMenuPosition,
  IMenuManagerService,
  RibbonOthersGroup,
  RibbonStartGroup,
} from "@univerjs/ui";
import type { IMenuItemFactory } from "@univerjs/ui";
import { IMenuService } from "@univerjs/ui";

import { CustomMenuItemSingleButtonFactory } from "./menu/single-button.menu";
// 按钮事件
import { SingleButtonOperation } from "../commands/operations/single-button.operation";
// 下拉事件
import {
  DropdownListFirstItemOperation,
  DropdownListSecondItemOperation,
} from "../commands/operations/dropdown-list.operation";
// 菜单项图标
// import { ButtonIcon } from '../components/button-icon/ButtonIcon';
// import { ButtonIcon } from '../components/button-icon/ButtonIcon';
// import { MainButtonIcon } from '../components/main-button-icon/MainButtonIcon';
// import { ItemIcon } from '../components/item-icon/ItemIcon';
import {
  CUSTOM_MENU_DROPDOWN_LIST_OPERATION_ID,
  CustomMenuItemDropdownListFirstItemFactory,
  CustomMenuItemDropdownListMainButtonFactory,
  CustomMenuItemDropdownListSecondItemFactory,
} from "./menu/dropdown-list.menu";

export class CustomMenuController extends Disposable {
  constructor(
    @Inject(Injector) private readonly _injector: Injector,
    @ICommandService private readonly _commandService: ICommandService,
    @IMenuManagerService
    private readonly _menuMangerService: IMenuManagerService,
    @Inject(ComponentManager)
    private readonly _componentManager: ComponentManager
  ) {
    super();
    // this._componentManager.get(PermissionService)//Permission
    this._initCommands();
    this._registerComponents();
    this._initMenus();
  }

  /**
   * register commands
   */
  private _initCommands(): void {
    [
      // 注册三个菜单事件
      SingleButtonOperation,
      DropdownListFirstItemOperation,
      DropdownListSecondItemOperation,
    ].forEach((c) => {
      this.disposeWithMe(this._commandService.registerCommand(c));
    });
  }

  /**
   * register icon components
   */
  //    注册菜单栏图标
  private _registerComponents(): void {
    const componentManager = this._componentManager;
    // this.disposeWithMe(componentManager.register("ButtonIcon", ButtonIcon));
    // this.disposeWithMe(componentManager.register("MainButtonIcon", MainButtonIcon));
    // this.disposeWithMe(componentManager.register("ItemIcon", ItemIcon));
  }

  /**
   * register menu items
   */
  // 注册菜单
  private _initMenus(): void {
    this._menuMangerService.mergeMenu({
      [RibbonStartGroup.OTHERS]: {
        [SingleButtonOperation.id]: {
          order: 10,
          menuItemFactory: CustomMenuItemSingleButtonFactory,
        },
        [CUSTOM_MENU_DROPDOWN_LIST_OPERATION_ID]: {
          order: 11,
          menuItemFactory: CustomMenuItemDropdownListMainButtonFactory,
          [DropdownListFirstItemOperation.id]: {
            order: 0,
            menuItemFactory: CustomMenuItemDropdownListFirstItemFactory,
          },
          [DropdownListSecondItemOperation.id]: {
            order: 1,
            menuItemFactory: CustomMenuItemDropdownListSecondItemFactory,
          },
        },
      },
      [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
          //自定义按钮
          [SingleButtonOperation.id]: {
            order: 12,
            menuItemFactory: CustomMenuItemSingleButtonFactory,
          },
          // 自定义下拉
          [CUSTOM_MENU_DROPDOWN_LIST_OPERATION_ID]: {
            order: 9,
            menuItemFactory: CustomMenuItemDropdownListMainButtonFactory,
            [DropdownListFirstItemOperation.id]: {
              order: 0,
              menuItemFactory: CustomMenuItemDropdownListFirstItemFactory,
            },
            [DropdownListSecondItemOperation.id]: {
              order: 1,
              menuItemFactory: CustomMenuItemDropdownListSecondItemFactory,
            },
          },
        },
      },
    });
  }
}
