<script lang="ts">
  import { onMount } from "svelte";
  import { signOut } from "@auth/sveltekit/client";

  import { page } from "$app/stores";
  import type { UserSummary } from "$data/user-summary";
  import { invalidateAll } from "$app/navigation";
  import type { Login } from "$lib/types";

  import TagsSubjectsSummaryItem from "./TagsSubjectsSummaryItem.svelte";

  import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarFooter
  } from "$lib/components/ui/sidebar";
  import { BookIcon, BookOpenIcon, LogOutIcon, MailIcon } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import { Avatar } from "bits-ui";
  import { profilePaneState } from "./profile-pane-state.svelte";

  type Props = {
    // loggedInUser: Login;
    // userSummary: UserSummary | undefined;
  };

  //let { loggedInUser, userSummary }: Props = $props();
  let { tags, subjects } = $derived($page.data);
</script>

<Sidebar side="left" class="z-50">
  <!-- User Profile Header -->
  <SidebarHeader class="p-4">
    <div class="flex items-center space-x-4">
      <div class="space-y-1">
        <h2 class="text-lg font-semibold">Adam</h2>
      </div>
    </div>
  </SidebarHeader>

  <Separator />

  <!-- Library Stats -->
  <SidebarContent>
    <!-- Total Books -->
    <SidebarGroup>
      <SidebarGroupLabel>Library Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BookOpenIcon class="mr-2 h-4 w-4" />
              <span>Total Books</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{10}</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

    <!-- Subject Stats -->
    <SidebarGroup>
      <SidebarGroupLabel>Subject Analysis</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <!-- Most Popular -->
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BookIcon class="mr-2 h-4 w-4 text-emerald-500" />
              <span>Most Read: History</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{9}</SidebarMenuBadge>
          </SidebarMenuItem>

          <!-- Least Popular -->
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BookIcon class="mr-2 h-4 w-4 text-orange-500" />
              <span>Least Read: Economics</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>2</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <Separator />

  <!-- Footer with Email and Logout -->
  <SidebarFooter class="p-4">
    <div class="space-y-4">
      <!-- Email -->
      <div class="flex items-center space-x-2 text-sm text-muted-foreground">
        <MailIcon class="h-4 w-4" />
        <span>a@aol.com</span>
      </div>
      <!-- Logout Button -->
      <Button
        variant="destructive"
        class="w-full"
        onclick={() => {
          profilePaneState.close();
        }}
      >
        <LogOutIcon class="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  </SidebarFooter>
</Sidebar>
