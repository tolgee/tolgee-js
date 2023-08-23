'use client';

import { useEffect, useState } from 'react';
import { T, useTranslate } from '@tolgee/react';

const getInitialItems = () => {
  const items: string[] =
    typeof window !== undefined
      ? JSON.parse(localStorage.getItem('tolgee-example-app-items') || '[]')
      : [];

  return items?.length
    ? items
    : ['Flame-thrower', 'Horse', 'My favourite toothbrush'];
};

export const Todos = () => {
  const { t } = useTranslate();

  const [newItemValue, setNewItemValue] = useState('');
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(getInitialItems());
  }, []);

  useEffect(() => {
    localStorage.setItem('tolgee-example-app-items', JSON.stringify(items));
  }, [items]);

  const onAdd = () => {
    setItems([...items, newItemValue]);
    setNewItemValue('');
  };

  const onDelete = (index: number) => () => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onAction = (action: string) => () => {
    alert('action: ' + action);
  };

  return (
    <section className="items">
      <div className="items__new-item">
        <input
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={t({
            key: 'add-item-input-placeholder',
            defaultValue: 'New list item',
          })}
        />
        <button onClick={onAdd} disabled={!newItemValue} className="button">
          <T keyName="add-item-add-button">Add</T>
        </button>
      </div>
      <div className="items__list">
        {items.map((item, i) => (
          <div key={i} className="item">
            <div className="item__text">{item}</div>
            <button onClick={onDelete(i)}>
              <T keyName="delete-item-button">Delete</T>
            </button>
          </div>
        ))}
      </div>
      <div className="items__buttons">
        <button className="button" onClick={onAction('share')}>
          <T keyName="share-button">Share</T>
        </button>
        <button
          className="button button--secondary"
          onClick={onAction('email')}
        >
          <T keyName="send-via-email">Send via e-mail</T>
        </button>
      </div>
    </section>
  );
};
