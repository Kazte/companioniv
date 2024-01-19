import {
  Menubar as Menu,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '../ui/menubar';
import {ModeToggle} from '@/components/mode-toggle.tsx';


export default function Menubar() {
  return (
    <Menu className="rounded-none border-b border-divider px-2 lg:px-4 justify-between py-6">
      {/*<MenubarLabel>CompanionIV</MenubarLabel>*/}
      <MenubarMenu>
        <MenubarTrigger className="font-bold">File</MenubarTrigger>

        <MenubarContent>
          <MenubarItem>About CompanionIV</MenubarItem>
          <MenubarSeparator/>
          <MenubarItem>
            Preferences...
          </MenubarItem>
          <MenubarSeparator/>
          <MenubarItem>
            Hide Music...
          </MenubarItem>
          <MenubarItem>
            Hide Others...
          </MenubarItem>
          <MenubarItem>
            Quit Music
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <ModeToggle/>
    </Menu>
  );
}