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
import {ButtonIcon} from '../components/ButtonIcon';
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
    this._initCommands();
    this._registerComponents();
    this._initMenus();
  }
 
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

  //    注册菜单栏图标
  private _registerComponents(): void {
    const componentManager = this._componentManager;
    // 此处注册图标使用vue3组件，导出svg，componentManager.register和框架自带的侧边栏注册方法相同。
    this.disposeWithMe(componentManager.register(
      'ButtonIcon',
      ButtonIcon,
      // 如果组件是Vue3组件，需要设置框架为'vue3'
      { framework: 'vue3' }
    ))
   
  }

  // 注册菜单
  private _initMenus(): void {
    this._menuMangerService.mergeMenu({
      // [RibbonStartGroup.OTHERS]: {
      //   [SingleButtonOperation.id]: {
      //     order: 10,
      //     menuItemFactory: CustomMenuItemSingleButtonFactory,
      //   },
      //   [CUSTOM_MENU_DROPDOWN_LIST_OPERATION_ID]: {
      //     order: 11,
      //     menuItemFactory: CustomMenuItemDropdownListMainButtonFactory,
      //     [DropdownListFirstItemOperation.id]: {
      //       order: 0,
      //       menuItemFactory: CustomMenuItemDropdownListFirstItemFactory,
      //     },
      //     [DropdownListSecondItemOperation.id]: {
      //       order: 1,
      //       menuItemFactory: CustomMenuItemDropdownListSecondItemFactory,
      //     },
      //   },
      // },
      [ContextMenuPosition.MAIN_AREA]: {
        [ContextMenuGroup.OTHERS]: {
          //自定义按钮
          [SingleButtonOperation.id]: {
            order: 12,//排序，数字越小，越靠菜单顶部
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
