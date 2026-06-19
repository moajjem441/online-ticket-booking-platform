"use client";
import { useTheme } from "next-themes";

import {Switch} from "@heroui/react";


const ThemeToggleButton = () => {
      const { theme, setTheme } = useTheme();
    return (
   

     <Switch onChange={()=> setTheme(theme==="dark" ? "light" : "dark")}>
      {({isSelected}) => (
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {/* {isSelected ? "Enabled" : "Disabled"} */}
        </Switch.Content>
      )}
    </Switch>
    );
};

export default ThemeToggleButton;