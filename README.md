# ion-slide-box-tabs

This plugin extends Ionic framework V1's ion-slide-box with selectable tabs. Based off of https://github.com/JKnorr91/ion-slide-box-tabs.

## Installing ionSlideBoxTabs

1. Add the *ionSlideBoxTabs.js* and the *ionSlideBoxTabs.css*to your Ionic Project and include it in your *index.html*.

  ```html
  <script src="app/ionSlideBoxTabs/slidingTabsDirective.js"></script>
  ```

2. Add the SCSS in *ionSlideBoxTabs.scss* to your project's scss file.

## Using ionSlideBoxTabs

Add the *ion-slide-blox-tabs* Rlement as a wrapper around the *ion-slide-box* Element.
To name the Tabs use the Attribute *slide-tab-label="yourLabel"* to the slides of the Slidebox.
Be sure to add the $emit() function to the *ion-slide-box* element. 

```html
<ion-content>
  <ion-slide-blox-tabs>
    <ion-slide-box show-pager="false" on-slide-changed="$emit('slideChanged')">
        <ion-slide slide-tab-label="One"><h1>Tab 1</h1></ion-slide>
        <ion-slide slide-tab-label="Two"><h1>Tab 2</h1></ion-slide>
        <ion-slide slide-tab-label="Three"><h1>Tab 3</h1></ion-slide>
    </ion-slide-box>
  <ion-slide-blox-tabs>
</ion-content>
```
