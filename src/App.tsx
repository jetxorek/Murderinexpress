import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from './store/gameStore';
import { getScene } from './data/scenes';
import { CHARACTERS, SUSPECT_IDS } from './data/characters';
import { NoteSpan } from './schemas/note';
import { NoteCategory } from './data/truthTable';
import { Icon } from './components/common/Icon';
import { AudioControls } from './components/common/AudioControls';
import { useAudioController } from './hooks/useAudioController';
import './index.css';

const CHAR_ICONS: Record<string, 'char_01' | 'char_02' | 'char_03' | 'char_04' | 'char_05' | 'char_06' | 'char_07' | 'detective' | 'victim'> = {
  char_01: 'char_01', char_02: 'char_02', char_03: 'char_03', char_04: 'char_04',
  char_05: 'char_05', char_06: 'char_06', char_07: 'char_07', detective: 'detective', victim: 'victim',
};

const CATEGORY_LABELS: Record<string, string> = {
  motive: 'Мотив', opportunity: 'Возможность', alibi: 'Алиби',
  psychology: 'Психология', contradiction: 'Противоречие',
};

const TONE_LABELS: Record<string, string> = {
  neutral: '', soft: 'мягко', logical: 'логично', pressure: 'давить', sympathy: 'сочувствие',
};

function SnowParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 2 + Math.random() * 3,
    })), []);
  return (
    <div className="snow-particles">
      {particles.map(p => (
        <div key={p.id} className="snow-particle" style={{
          left: `${p.left}%`, animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`, width: p.size, height: p.size,
        }} />
      ))}
    </div>
  );
}

function NoteSpanText({ text, noteSpans, onAddNote }: {
  text: string; noteSpans?: NoteSpan[]; onAddNote: (span: NoteSpan) => void;
}) {
  const notes = useGameStore(s => s.notes);
  if (!noteSpans || noteSpans.length === 0) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  for (const span of noteSpans) {
    const idx = remaining.indexOf(span.text);
    if (idx === -1) continue;
    if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    const isAdded = notes.some(n => n.id === span.id);
    parts.push(
      <span
        key={key++}
        className={`note-highlight ${isAdded ? 'added' : ''}`}
        onClick={() => !isAdded && onAddNote(span)}
        title={isAdded ? '✓ В блокноте' : 'Нажмите, чтобы занести в блокнот'}
      >
        {span.text}
      </span>
    );
    remaining = remaining.slice(idx + span.text.length);
  }
  if (remaining) parts.push(<span key={key++}>{remaining}</span>);
  return <>{parts}</>;
}

function MenuScreen() {
  const { newGame, continueGame, hasSave } = useGameStore();
  const saved = hasSave();
  return (
    <div className="menu">
      <SnowParticles />
      <h1 className="menu__title">Убийство в<br />Дальневосточном экспрессе</h1>
      <p className="menu__subtitle">Интерактивный психологический детектив</p>
      <button className="menu__btn" onClick={newGame}>Новая игра</button>
      <button className="menu__btn" onClick={continueGame} disabled={!saved}>
        Продолжить
      </button>
      <div style={{ marginTop: '2rem' }}>
        <AudioControls />
      </div>
      <div className="menu__version">v0.1.0 • Глава 1</div>
    </div>
  );
}

function SceneScreen() {
  const {
    currentSceneId, currentNodeId, sceneSlotsLeft, suspicion,
    trust, notes, advanceNode, addNote, setScreen, applyChoiceEffects,
    accusedIds, toggleAccused,
  } = useGameStore();

  const scene = getScene(currentSceneId);
  if (!scene) return <div className="scene"><div className="scene__text">Сцена не найдена</div></div>;

  const node = scene.nodes[currentNodeId];
  if (!node) return <div className="scene"><div className="scene__text">Узел не найден</div></div>;

  const speaker = node.type === 'dialogue' ? CHARACTERS[node.speaker] : null;
  const noteSpans = (node.type === 'narration' || node.type === 'dialogue') ? node.noteSpans : undefined;
  const text = node.type === 'narration' || node.type === 'dialogue' ? node.text : '';

  return (
    <div className="scene">
      <div className="scene__bg" />
      <SnowParticles />

      <div className="scene__header">
        <span className="scene__title">{scene.title}</span>
        <span className="scene__slots">Слоты: {sceneSlotsLeft} | <Icon name="detective" size={14} /> {suspicion}%</span>
      </div>

      <div className="scene__content">
        {speaker && (
          <div className="scene__speaker">
            <div className="scene__speaker-avatar">
              {CHAR_ICONS[speaker.id] ? <Icon name={CHAR_ICONS[speaker.id]} size={24} /> : '?'}
            </div>
            <div>
              <div className="scene__speaker-name">{speaker.name}</div>
              <div className="scene__speaker-role">{speaker.roleShort}</div>
            </div>
          </div>
        )}

        <div className="scene__text">
          <NoteSpanText text={text} noteSpans={noteSpans} onAddNote={addNote} />
        </div>

        {node.type === 'choice' && (
          <div className="choices">
            <div className="choices__prompt">{node.prompt}</div>
            {node.options.map(opt => (
              <button
                key={opt.id}
                className={`choice-btn ${opt.risk === 'high' ? 'choice-btn--risky' : ''}`}
                onClick={() => applyChoiceEffects(opt.effects)}
              >
                {opt.tone && opt.tone !== 'neutral' && (
                  <span className="choice-btn__tone">[{TONE_LABELS[opt.tone]}]</span>
                )}
                {opt.text}
                {opt.risk === 'high' && <Icon name="warning" size={14} />}
              </button>
            ))}
          </div>
        )}

        {node.type !== 'choice' && node.type !== 'end' && (
          <div className="scene__actions">
            <button className="scene__next-btn" onClick={() => advanceNode()}>
              Далее →
            </button>
          </div>
        )}
      </div>

      <div className="bottom-buttons">
        <button className="bottom-btn" onClick={() => setScreen('notebook')}>
          <Icon name="notebook" size={16} /> Блокнот {notes.length > 0 && <span className="bottom-btn__badge">{notes.length}</span>}
        </button>
        <button className="bottom-btn" onClick={() => setScreen('accusation')} style={{ background: 'rgba(184,147,90,0.2)', borderColor: 'var(--brass)' }}>
          <Icon name="detective" size={16} /> Указать на убийцу
        </button>
        <button className="bottom-btn" onClick={() => setScreen('menu')}>
          <Icon name="menu" size={16} /> Меню
        </button>
      </div>

      <div className="char-bar">
        {SUSPECT_IDS.map(id => {
          const ch = CHARACTERS[id];
          return (
            <div
              key={id}
              className={`char-bar__item ${accusedIds.includes(id) ? 'char-bar__item--accused' : ''}`}
              onClick={() => toggleAccused(id)}
            >
              <div className="char-bar__avatar">
                <Icon name={CHAR_ICONS[id]} size={20} />
              </div>
              <div className="char-bar__name">{ch.name.split(' ')[0]}</div>
              <div className="char-bar__role">{ch.roleShort}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotebookOverlay() {
  const { notes, removeNote, setScreen } = useGameStore();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? notes : notes.filter(n => n.category === filter);
  const categories = ['all', 'motive', 'opportunity', 'alibi', 'psychology', 'contradiction'];

  return (
    <div className="overlay">
      <div className="overlay__header">
        <span className="overlay__title"><Icon name="notebook" size={18} /> Блокнот</span>
        <button className="overlay__close" onClick={() => setScreen('scene')}><Icon name="close" size={16} /></button>
      </div>
      <div className="overlay__body">
        <div className="note-filters">
          {categories.map(c => (
            <button
              key={c}
              className={`note-filter ${filter === c ? 'note-filter--active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c === 'all' ? 'Все' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--snow)', opacity: 0.5, textAlign: 'center', marginTop: '2rem' }}>
            Пока пусто. Выделяйте подозрительные фразы в тексте.
          </p>
        )}
        {filtered.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-card__header">
              <span className="note-card__strength">{note.strength === 'strong' ? '●' : '◦'}</span>
              <span className={`note-card__category note-card__category--${note.category}`}>
                {CATEGORY_LABELS[note.category]}
              </span>
              <span className="note-card__target">
                {CHARACTERS[note.target]?.name?.split(' ').slice(-1) || note.target}
              </span>
            </div>
            <div className="note-card__text">«{note.text}»</div>
            <div className="note-card__truth">
              {note.truth === 'true' ? '✓ Подтверждено' : note.truth === 'false' ? '✗ Ложь' : '~ Неизвестно'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccusationScreen() {
  const {
    notes, accusedIds, selectedNoteIds, toggleAccused, toggleNoteForAccusation,
    submitAccusation, setScreen, getStrengthLabel, getTextScore,
  } = useGameStore();

  const score = getTextScore();
  const label = getStrengthLabel();

  return (
    <div className="overlay">
      <div className="overlay__header">
        <span className="overlay__title"><Icon name="accuse" size={18} /> Обвинение</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="overlay__close" onClick={() => setScreen('notebook')} title="Открыть блокнот"><Icon name="notebook" size={16} /></button>
          <button className="overlay__close" onClick={() => setScreen('scene')}><Icon name="close" size={16} /></button>
        </div>
      </div>
      <div className="overlay__body" style={{ flex: 1 }}>
        <div className="accusation__section">
          <div className="accusation__section-title">Обвиняемые ({accusedIds.length}/7)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUSPECT_IDS.map(id => {
              const ch = CHARACTERS[id];
              return (
                <button
                  key={id}
                  className={`note-card ${accusedIds.includes(id) ? 'note-card--selected' : ''}`}
                  onClick={() => toggleAccused(id)}
                  style={{ textAlign: 'left' }}
                >
                  <div className="note-card__header">
                    <Icon name={CHAR_ICONS[id]} size={24} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--paper)', fontWeight: 'bold' }}>
                      {ch.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--snow)', opacity: 0.7, marginTop: 4 }}>
                    {ch.role}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="accusation__section">
          <div className="accusation__section-title">Аргументы ({selectedNoteIds.length}/7, мин. 3)</div>
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-card ${selectedNoteIds.includes(note.id) ? 'note-card--selected' : ''}`}
              onClick={() => toggleNoteForAccusation(note.id)}
            >
              <div className="note-card__header">
                <span className="note-card__strength">{note.strength === 'strong' ? '●' : '◦'}</span>
                <span className={`note-card__category note-card__category--${note.category}`}>
                  {CATEGORY_LABELS[note.category]}
                </span>
                <span className="note-card__target">
                  {CHARACTERS[note.target]?.name?.split(' ').slice(-1) || note.target}
                </span>
              </div>
              <div className="note-card__text">«{note.text}»</div>
            </div>
          ))}
          {notes.length === 0 && (
            <p style={{ color: 'var(--snow)', opacity: 0.5, textAlign: 'center' }}>
              Нет заметок. Вернитесь к расследованию.
            </p>
          )}
        </div>
      </div>

      <div className="accusation__indicator">
        <span className="accusation__strength">
          Дело: {score >= 0 ? label : '—'}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--snow)', opacity: 0.5 }}>
          {score >= 0 ? `Счёт: ${score.toFixed(1)}` : ''}
        </span>
      </div>

      <button
        className="accusation__submit"
        disabled={accusedIds.length === 0 || selectedNoteIds.length < 3}
        onClick={submitAccusation}
      >
        Предъявить обвинение
      </button>
    </div>
  );
}

function ResultScreen() {
  const { lastResult, setScreen, newGame } = useGameStore();
  if (!lastResult) return null;

  const titles: Record<string, string> = {
    fail: 'Обвинение рассыпалось',
    partial_low: 'Один из семерых',
    partial_high: 'Почти вся картина',
    full: 'Все семеро',
  };

  const texts: Record<string, string> = {
    fail: 'Пирогов назвал имя — и ошибся. Обвиняемый смотрит с жалостью. Полицейский закрывает папку. Репутация детектива пострадала.',
    partial_low: 'Один из обвиняемых побледнел и кивнул. Но остальные молчат. Пирогов видит часть картины, но не всю.',
    partial_high: 'Многие из названных переглянулись. «Вы правы, но вы не знаете всего.» Пирогов понимает: сговор глубже.',
    full: 'Пирогов назвал все семь имён. Тишина. Княгиня первая подняла голову: «Вы правы, месье. Мы все.»',
  };

  return (
    <div className="result">
      <h2 className={`result__title result__title--${lastResult.outcome === 'full' ? 'full' : lastResult.outcome === 'fail' ? 'fail' : 'partial'}`}>
        {titles[lastResult.outcome]}
      </h2>
      <p className="result__text">{texts[lastResult.outcome]}</p>
      <div className="result__stats">
        Счёт: {lastResult.score.toFixed(1)} | Покрытие: {lastResult.coverage}/5 |
        Обвиняемых: {lastResult.accusedCount} | Сильных: {lastResult.strongCount}
      </div>
      {lastResult.outcome === 'full' ? (
        <button className="menu__btn" onClick={() => {
          useGameStore.setState({
            currentSceneId: 'ch4_04_moral_choice',
            currentNodeId: 'n1',
            screen: 'scene',
            textRevealed: false,
          });
        }}>Далее →</button>
      ) : (
        <>
          <button className="menu__btn" onClick={() => setScreen('scene')}>Вернуться</button>
          <button className="menu__btn" onClick={newGame} style={{ marginTop: 8 }}>Заново</button>
        </>
      )}
    </div>
  );
}

function FinaleScreen() {
  const { finaleChoice, setFinaleChoice, newGame, setScreen } = useGameStore();

  const epilogues: Record<string, string> = {
    law: 'Семеро арестованы. Пирогов получил орден. Но по ночам он видит девочку с двумя косичками и серьёзным лицом. И понимает: закон есть, а справедливости нет.',
    justice: 'Полиция уехала ни с чем. «Неизвестный убийца скрылся в снегу.» Пирогов солгал — и спас семерых. Но ложь — тоже тяжесть. Он будет носить её до конца.',
    silence: 'Пирогов вышел в снег и пошёл по платформе, не оглядываясь. Семеро остались в вагоне — наедине с тем, что сделали. Может быть, это и есть справедливость. А может — просто тишина.',
  };

  return (
    <div className="finale">
      <SnowParticles />
      {!finaleChoice ? (
        <>
          <p className="finale__text">
            Пирогов достал часы. Стрелки застыли на 2:15. Он посмотрел на семерых — на людей, которые убили человека, чтобы отомстить за ребёнка. И сказал:
          </p>
          <div className="finale__choices">
            <button className="finale__choice" onClick={() => setFinaleChoice('law')}>
              «Я вызываю полицию. Закон есть закон.»
            </button>
            <button className="finale__choice" onClick={() => setFinaleChoice('justice')}>
              «Я расскажу о неизвестном убийце, который скрылся в снегу.»
            </button>
            <button className="finale__choice" onClick={() => setFinaleChoice('silence')}>
              «Я ничего не скажу. Пусть решают сами.»
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="result__title result__title--full">
            Концовка: {finaleChoice === 'law' ? 'Закон' : finaleChoice === 'justice' ? 'Справедливость' : 'Молчание'}
          </h2>
          <p className="finale__epilogue">{epilogues[finaleChoice]}</p>
          <p className="finale__epilogue" style={{ marginTop: '1rem', opacity: 0.6 }}>
            Снег шёл ровно, без ветра.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="menu__btn" onClick={newGame}>
              Начать заново
            </button>
            <button className="menu__btn" onClick={() => setScreen('menu')}>
              Главное меню
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChapterEndScreen() {
  const { setScreen, notes, currentSceneId } = useGameStore();
  
  const isChapter1End = currentSceneId === 'ch1_05_morning';
  const isChapter2End = currentSceneId === 'ch2_05_police_announce';
  const isChapter3End = currentSceneId === 'ch3_05_storm';
  
  const handleContinue = () => {
    if (isChapter1End) {
      useGameStore.setState({
        currentSceneId: 'ch2_01_crime_scene',
        currentNodeId: 'n1',
        sceneSlotsLeft: 6,
        screen: 'scene',
        textRevealed: false,
      });
    } else if (isChapter2End) {
      useGameStore.setState({
        currentSceneId: 'ch3_01_late_interviews',
        currentNodeId: 'n1',
        sceneSlotsLeft: 6,
        screen: 'scene',
        textRevealed: false,
      });
    } else if (isChapter3End) {
      useGameStore.setState({
        currentSceneId: 'ch4_01_police_arrival',
        currentNodeId: 'n1',
        sceneSlotsLeft: 4,
        screen: 'scene',
        textRevealed: false,
      });
    }
  };
  
  const getChapterTitle = () => {
    if (isChapter1End) return 'Конец Главы 1';
    if (isChapter2End) return 'Конец Главы 2';
    if (isChapter3End) return 'Конец Главы 3';
    return 'Конец главы';
  };
  
  const getChapterText = () => {
    if (isChapter1End) {
      return (
        <>
          Тело Степана Разумова найдено. Семь ножевых ранений. У всех наготове алиби.
          <br /><br />
          Пирогов поправил усы и посмотрел на снег за окном. Расследование только начинается.
        </>
      );
    }
    if (isChapter2End) {
      return (
        <>
          Полиция прибудет через несколько часов. Время идёт.
          <br /><br />
          Пирогов собрал первые улики. Но впереди — поздние допросы, новые противоречия, рискованные решения.
        </>
      );
    }
    if (isChapter3End) {
      return (
        <>
          Метель усилилась. Поезд стоит. Полиция задерживается.
          <br /><br />
          Пирогов собрал все улики, все противоречия, все психологические портреты. Пора называть имена.
        </>
      );
    }
    return null;
  };
  
  const getButtonText = () => {
    if (isChapter1End) return 'Продолжить расследование →';
    if (isChapter2End) return 'Начать поздние допросы →';
    if (isChapter3End) return 'Перейти к обвинению →';
    return 'Продолжить';
  };
  
  return (
    <div className="chapter-end">
      <SnowParticles />
      <h2 className="chapter-end__title">{getChapterTitle()}</h2>
      <p className="chapter-end__text">{getChapterText()}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--snow)', opacity: 0.5, marginBottom: '2rem' }}>
        Заметок собрано: {notes.length}
      </p>
      <button className="menu__btn" onClick={handleContinue}>
        {getButtonText()}
      </button>
      <button className="menu__btn" onClick={() => setScreen('scene')} style={{ marginTop: 8 }}>
        Вернуться
      </button>
    </div>
  );
}

export default function App() {
  const { screen, toast } = useGameStore();
  useAudioController();

  return (
    <div className="app">
      {screen === 'menu' && <MenuScreen />}
      {screen === 'scene' && <SceneScreen />}
      {screen === 'notebook' && <NotebookOverlay />}
      {screen === 'accusation' && <AccusationScreen />}
      {screen === 'result' && <ResultScreen />}
      {screen === 'finale' && <FinaleScreen />}
      {screen === 'chapterEnd' && <ChapterEndScreen />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
