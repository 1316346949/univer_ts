import type { IMenuButtonItem } from '@univerjs/ui';
import { MenuItemType } from '@univerjs/ui';

import { SingleButtonOperation } from '../../commands/operations/single-button.operation';

export function CustomMenuItemSingleButtonFactory(): IMenuButtonItem<string> {
    return {
        // Bind the command id, clicking the button will trigger this command
        id: SingleButtonOperation.id,
        // The type of the menu item, in this case, it is a button
        type: MenuItemType.BUTTON,
        // The icon of the button, which needs to be registered in ComponentManager
        icon: 'ButtonIcon',//此处是右键自定义菜单的icon
        // The tooltip of the button. Prioritize matching internationalization. If no match is found, the original string will be displayed
        tooltip: 'customMenu.singleButton',
        // The title of the button. Prioritize matching internationalization. If no match is found, the original string will be displayed
        title: 'customMenu.button',
    };
}
