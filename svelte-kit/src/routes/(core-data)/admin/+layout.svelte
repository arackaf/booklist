<script lang="ts">
  import { page } from "$app/stores";
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";

  $: ({ isPublic } = $page.data);
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: var(--content-max-width)">
    <div>
      <div class="panel-body" style="position: relative">
        <SectionNav>
          <SectionNavItem href="/admin/similar-items">Similar Items</SectionNavItem>
          <SectionNavItem href="/admin/users">Users</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
