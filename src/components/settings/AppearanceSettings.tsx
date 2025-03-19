
import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Monitor, Moon, Sun } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme-mode">Theme Mode</Label>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Current theme</span>
              <span className="text-sm text-muted-foreground">
                {theme === "light" && "Light"}
                {theme === "dark" && "Dark"}
                {theme === "system" && "System"}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <Tabs defaultValue={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="light" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Light
            </TabsTrigger>
            <TabsTrigger value="dark" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Dark
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>
          <TabsContent value="light" className="mt-4">
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-primary">
              <div className="text-center font-medium">
                <div className="bg-background text-foreground p-4 rounded-md shadow">
                  Light Mode Preview
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="dark" className="mt-4">
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-primary bg-[#121212]">
              <div className="text-center font-medium">
                <div className="bg-[#1e1e1e] text-white p-4 rounded-md shadow">
                  Dark Mode Preview
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="system" className="mt-4">
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-primary">
              <div className="text-center font-medium">
                <div className="p-4 rounded-md shadow bg-gradient-to-r from-background to-[#121212] text-foreground">
                  System Preference
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          System preference will automatically switch between light and dark modes based on your system settings.
        </div>
      </CardFooter>
    </Card>
  );
}
