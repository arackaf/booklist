<svelte:options runes={true} />

<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
</script>

<div class="max-w-[400px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[550px]">
  <div data-reach-dialog-content class="border-4 border-[var(--primary-3)] rounded-xl lg:p-5 p-3">
    <h4 class="text-lg font-medium">Book Search</h4>
    <Separator class="my-4 h-[2px]" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-2">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1.5">
            <Label>Search title</Label>
            <Input placeholder="Search title" value="The Slefish Gene" />
          </div>
        </div>
      </div>
      <div class="col-span-2 md:col-span-1">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1.5">
            <Label>Publisher</Label>
            <Input placeholder="Publisher" value="Basic Books" />
          </div>
        </div>
      </div>
      <div class="col-span-2 md:col-span-1">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1.5">
            <Label>Author</Label>
            <Input placeholder="Author" value="Richard Dawkins" />
          </div>
        </div>
      </div>
    </div>
    <Separator class="my-4 h-[2px]" />
    <div class="flex flex-row">
      <Button>Filter</Button>
      <Button variant="outline" class="ml-auto">Close</Button>
    </div>
  </div>
</div>
