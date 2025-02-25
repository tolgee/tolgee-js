import { FormEvent, useState } from 'react';

import { Navbar } from './components/Navbar';
import { useTolgee } from './basicTolgee';

const getInitialItems = () => {
  let items: string[] | undefined = undefined;
  try {
    items = JSON.parse(localStorage.getItem('tolgee-example-app-items') || '');
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
    : ['Passport', 'Maps and directions', 'Travel guide'];
};

export const Todos = () => {
  const { t } = useTolgee(['update']);

  const [newItemValue, setNewItemValue] = useState('');
  const [items, setItems] = useState<string[]>(getInitialItems());

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
    <div className="background-wrapper">
      <div className="example">
        <Navbar>
          <a href="/translation-methods">
            {t('menu-item-translation-methods')}
          </a>
        </Navbar>
        <header>
          <img src="/img/appLogo.svg" />
          <h1 className="header__title">{t('app-title')}</h1>
        </header>
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
              {t('add-item-add-button')}
            </button>
          </form>
          <div className="items__list">
            {items.map((item, i) => (
              <div key={i} className="item">
                <div className="item__text">{item}</div>
                <button onClick={onDelete(i)}>{t('delete-item-button')}</button>
              </div>
            ))}
          </div>
          <div className="items__buttons">
            <button className="button" onClick={onAction('share')}>
              <img src="/img/iconShare.svg" />
              {t('share-button', 'Share')}
            </button>
            <button className="button" onClick={onAction('email')}>
              <img src="/img/iconMail.svg" />
              {t('send-via-email')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
