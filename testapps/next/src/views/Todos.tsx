import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';

import { T, useTranslate } from '@tolgee/react';

const getInitialItems = () => {
  let items: string[] | undefined = undefined;

  try {
    items = JSON.parse(
      localStorage.getItem('tolgee-example-app-items') || '[]'
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      'Something went wrong while parsing stored items. Items are reset.'
    );
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('tolgee-example-app-items');
    }
  }
  return items?.length
    ? items
    : ['Flame-thrower', 'Horse', 'My favourite toothbrush'];
};

export const Todos = () => {
  const t = useTranslate();

  const [newItemValue, setNewItemValue] = useState('');
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(getInitialItems());
  }, []);

  const updateLocalstorage = (items: string[]) => {
    localStorage.setItem('tolgee-example-app-items', JSON.stringify(items));
  };

  const onAdd = () => {
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
    <div className="background-wrapper">
      <div className="example">
        <Navbar>
          <Link href="/translation-methods">
            <a>
              <T keyName="menu-item-translation-methods" />
            </a>
          </Link>
        </Navbar>

        <header>
          <h1 className="header__title">
            <T keyName="on-the-road-title" />
          </h1>
          <h2 className="header__subtitle">
            <T keyName="on-the-road-subtitle" />
          </h2>
        </header>
        <section className="items">
          <div className="items__new-item">
            <input
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              placeholder={t({
                key: 'add-item-input-placeholder',
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
      </div>
    </div>
  );
};
