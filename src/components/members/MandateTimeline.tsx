import React from 'react';
import { Timeline } from 'react-vis';
import { RoleMandate } from '@/types/member';
import { roleLabels } from '@/utils/roles';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MandateTimelineProps {
  mandates: RoleMandate[];
}

export function MandateTimeline({ mandates }: MandateTimelineProps) {
  const timelineItems = mandates.map(mandate => ({
    id: mandate.id,
    title: roleLabels[mandate.role],
    start_time: new Date(mandate.startDate),
    end_time: new Date(mandate.endDate),
    color: mandate.isActive ? '#3498db' : '#95a5a6',
    itemProps: {
      style: {
        background: mandate.isActive ? '#3498db' : '#95a5a6',
        border: '1px solid #fff',
        borderRadius: '4px',
      }
    }
  }));

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Chronologie des mandats</h3>
      <Timeline
        items={timelineItems}
        groups={[{ id: 1, title: 'Mandats' }]}
        defaultTimeStart={new Date(Math.min(...mandates.map(m => new Date(m.startDate).getTime())))}
        defaultTimeEnd={new Date(Math.max(...mandates.map(m => new Date(m.endDate).getTime())))}
        itemRenderer={({ item, itemContext, getItemProps }) => (
          <div
            {...getItemProps({
              style: {
                ...itemContext.styles,
                ...item.itemProps.style,
                color: '#fff',
                padding: '4px 8px',
                fontSize: '12px',
              },
            })}
          >
            {item.title}
            <div className="text-xs">
              {format(item.start_time, 'MMM yyyy', { locale: fr })} -{' '}
              {format(item.end_time, 'MMM yyyy', { locale: fr })}
            </div>
          </div>
        )}
      />
    </div>
  );
}
