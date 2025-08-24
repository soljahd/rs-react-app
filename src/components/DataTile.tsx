import type { FormSchema } from '../schemas/formSchema';

type DataTileProps = {
  data: FormSchema & { _new?: boolean };
  className?: string;
};

export default function DataTile({ data, className = '' }: DataTileProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        data._new ? 'border-green-500 ring-2 shadow-green-100 ring-green-300' : 'border-gray-200'
      } ${className} `}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="truncate text-xl font-bold text-gray-900">{data.name}</h2>
          {data._new && (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                New entry
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {data.image ? (
              <img
                src={data.image}
                alt={`${data.name}'s avatar`}
                className="h-20 w-20 rounded-xl border-2 border-gray-100 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex gap-2">
              <span className="min-w-[70px] text-sm font-medium text-gray-600">Age:</span>
              <span className="text-sm text-gray-800">{data.age} years</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[70px] text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm break-words text-gray-800">{data.email}</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[70px] text-sm font-medium text-gray-600">Gender:</span>
              <span className="text-sm text-gray-800 capitalize">{data.gender}</span>
            </div>

            <div className="flex gap-2">
              <span className="min-w-[70px] text-sm font-medium text-gray-600">Country:</span>
              <span className="text-sm text-gray-800">{data.country}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
