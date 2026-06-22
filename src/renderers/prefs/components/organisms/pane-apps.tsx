import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import type { AppName } from '../../../../config/apps.js'
import Input from '../../../shared/components/atoms/input.js'
import { Spinner } from '../../../shared/components/atoms/spinner.js'
import type { InstalledApp } from '../../../shared/state/hooks.js'
import {
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
} from '../../../shared/state/hooks.js'
import {
  reorderedApp,
  toggledAppVisibility,
  updatedHotCode,
} from '../../state/actions.js'
import { Pane } from '../molecules/pane.js'

type SortableItemProps = {
  readonly id: InstalledApp['name']
  readonly name: InstalledApp['name']
  readonly index: number
  readonly icon?: string
  readonly keyCode?: string
  readonly isVisible: boolean
}

const EyeIcon = ({ visible }: { readonly visible: boolean }) =>
  visible ? (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

const SortableItem = ({
  id,
  name,
  keyCode = '',
  index,
  icon = '',
  isVisible,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const dispatch = useDispatch()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'flex',
        'bg-black/5 shadow dark:bg-white/5',
        'mb-4 rounded-xl',
        'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:focus-visible:bg-black',
        isDragging &&
          'focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100',
      )}
    >
      <div className="flex w-16 items-center justify-center p-4">
        {index + 1}
      </div>
      <div
        className={clsx(
          'flex grow items-center p-4',
          !isVisible && 'opacity-40',
        )}
      >
        <img
          alt=""
          className={clsx('mr-4 size-8', !icon && 'hidden')}
          src={icon}
        />
        <span>{name}</span>
      </div>
      <div className="flex items-center justify-center py-4">
        <button
          aria-label={`${
            isVisible ? 'Hide' : 'Show'
          } ${name} in the picker`}
          aria-pressed={!isVisible}
          className="rounded-lg p-2 opacity-60 hover:bg-black/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:hover:bg-white/10"
          data-app-id={id}
          onClick={() => {
            dispatch(toggledAppVisibility({ appName: id }))
          }}
          onPointerDown={(event) => {
            // Prevent the drag sensor from hijacking the click.
            event.stopPropagation()
          }}
          title={isVisible ? 'Hide from picker' : 'Show in picker'}
          type="button"
        >
          <EyeIcon visible={isVisible} />
        </button>
      </div>
      <div className="flex items-center justify-center p-4">
        <Input
          aria-label={`${name} hotkey`}
          className="h-8 w-12"
          data-app-id={id}
          maxLength={1}
          minLength={0}
          onChange={(event) => event.preventDefault()}
          onFocus={(event) => {
            event.target.select()
          }}
          onKeyPress={(event) => {
            dispatch(
              updatedHotCode({
                appName: id,
                value: event.code,
              }),
            )
          }}
          placeholder="Key"
          type="text"
          value={keyCode}
        />
      </div>
    </div>
  )
}

export function AppsPane(): JSX.Element {
  const dispatch = useDispatch()

  const installedApps = useInstalledApps().map((installedApp) => ({
    ...installedApp,
    id: installedApp.name,
  }))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      dispatch(
        reorderedApp({
          destinationName: over?.id as AppName,
          sourceName: active.id as AppName,
        }),
      )
    }
  }

  const icons = useDeepEqualSelector((state) => state.data.icons)

  const keyCodeMap = useKeyCodeMap()

  return (
    <Pane pane="apps">
      {installedApps.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="overflow-y-auto p-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={installedApps}
            strategy={verticalListSortingStrategy}
          >
            {installedApps.map(({ id, name, hotCode, isVisible }, index) => (
              <SortableItem
                key={id}
                icon={icons[id]}
                id={id}
                index={index}
                isVisible={isVisible}
                keyCode={keyCodeMap[hotCode || '']}
                name={name}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {installedApps.length > 1 && (
        <p className="mt-2 text-sm opacity-70">
          Drag and drop to sort the list of apps.
        </p>
      )}
    </Pane>
  )
}
