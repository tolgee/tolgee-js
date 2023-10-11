'use client';

import { FormEvent, useEffect, useState } from 'react';
import { T, useTranslate } from '@tolgee/react';

const getInitialItems = () => {
  const items: string[] =
    typeof window !== undefined
      ? JSON.parse(localStorage.getItem('tolgee-example-app-items') || '[]')
      : [];

  return items?.length
    ? items
    : ['Passport', 'Maps and directions', 'Travel guide'];
};

export const Todos = () => {
  const { t } = useTranslate();

  const [newItemValue, setNewItemValue] = useState('');
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(getInitialItems());
  }, []);

  const updateLocalstorage = (items: string[]) => {
    localStorage.setItem('tolgee-example-app-items', JSON.stringify(items));
  };

  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newItems = [...items, newItemValue];
    setItems(newItems);
    updateLocalstorage(newItems);
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
      <form className="items__new-item" onSubmit={onAdd}>
        <input
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={t({
            key: 'add-item-input-placeholder',
            defaultValue: 'New list item',
          })}
        />
        <button type="submit" disabled={!newItemValue} className="button">
          <img src="/img/iconAdd.svg" />
          <T keyName="add-item-add-button">Add</T>
        </button>
      </form>
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
          <img src="/img/iconShare.svg" />
          <T keyName="share-button">Share</T>
        </button>
        <button
          className="button button--secondary"
          onClick={onAction('email')}
        >
          <img src="/img/iconMail.svg" />
          <T keyName="send-via-email">Send via e-mail</T>
        </button>
      </div>
    </section>
  );
};
