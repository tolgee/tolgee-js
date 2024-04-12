import {
    VNodeArrayChildren,
    Slot,
  } from 'vue';

export const convertStringToVNodeArrayWithSlots = (
    str: string,
    slots: Record<string, Slot>
  ): VNodeArrayChildren => {
    const slotRegex = /\{([^}]+)\}/g;
    return str.split(slotRegex).map((part, index) => {
      if (index % 2 === 1 && slots[part]) {
        return slots[part]();
      }
  
      return part;
    });
  }