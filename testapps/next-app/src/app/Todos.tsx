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
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateLocalstorage(newItems);
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
          placeholder={t('add-item-input-placeholder')}
        />
        <button type="submit" disabled={!newItemValue} className="button">
          <img src="/img/iconAdd.svg" />
          <T keyName="add-item-add-button" />
        </button>
      </form>
      <div className="items__list">
        {items.map((item, i) => (
          <div key={i} className="item">
            <div className="item__text">{item}</div>
            <button onClick={onDelete(i)}>
              <T keyName="delete-item-button" />
            </button>
          </div>
        ))}
      </div>
      <div className="items__buttons">
        <button className="button" onClick={onAction('share')}>
          <img src="/img/iconShare.svg" />
          <T keyName="share-button" />
        </button>
        <button
          className="button button--secondary"
          onClick={onAction('email')}
        >
          <img src="/img/iconMail.svg" />
          <T keyName="send-via-email" />
        </button>
      </div>
    </section>
  );
};
