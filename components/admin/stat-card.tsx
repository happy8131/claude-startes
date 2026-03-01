import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  color?: 'default' | 'yellow' | 'green' | 'red'
}

const colorStyles = {
  default: 'text-blue-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
  red: 'text-red-500',
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'default',
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs mt-1">{description}</CardDescription>
          )}
        </div>
        {Icon && <Icon className={cn('w-5 h-5', colorStyles[color])} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
