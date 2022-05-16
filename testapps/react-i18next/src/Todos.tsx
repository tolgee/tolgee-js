import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';

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
    : ['Flame-thrower', 'Horse', 'My favourite toothbrush'];
};

export const Todos = () => {
  const { t } = useTranslation('todos');

  const [newItemValue, setNewItemValue] = useState('');
  const [items, setItems] = useState<string[]>(getInitialItems());

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
    <div className="background-wrapper">
      <div className="example">
        <Navbar>
          <a href="/translation-methods">
            {t('menu-item-translation-methods', {
              defaultValue: 'Translation methods',
            })}
          </a>
        </Navbar>

        <header>
          <h1 className="header__title">
            {t('on-the-road-title', { defaultValue: 'On the road' })}
          </h1>
          <h2 className="header__subtitle">
            {t('on-the-road-subtitle', {
              defaultValue: 'what to pack for the trip',
            })}
          </h2>
        </header>
        <section className="items">
          <div className="items__new-item">
            <input
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              placeholder={t('add-item-input-placeholder', {
                defaultValue: 'New list item',
              })}
            />
            <button onClick={onAdd} disabled={!newItemValue} className="button">
              {t('add-item-add-button', { defaultValue: 'Add' })}
            </button>
          </div>
          <div className="items__list">
            {items.map((item, i) => (
              <div key={i} className="item">
                <div className="item__text">{item}</div>
                <button onClick={onDelete(i)}>
                  {t('delete-item-button', { defaultValue: 'Delete' })}
                </button>
              </div>
            ))}
          </div>
          <div className="items__buttons">
            <button className="button" onClick={onAction('share')}>
              {t('share-button', { defaultValue: 'Share' })}
            </button>
            <button
              className="button button--secondary"
              onClick={onAction('email')}
            >
              {t('send-via-email', { defaultValue: 'Send via e-mail' })}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
