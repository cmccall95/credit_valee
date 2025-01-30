<!-- src/lib/components/PaymentCalendar.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { CalendarDays } from 'lucide-svelte';
    import { parseDate } from '@internationalized/date'; // For date handling
    import Card from '$lib/components/ui/card/card.svelte';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import CardTitle from '$lib/components/ui/card/card-title.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import Calendar from '$lib/components/ui/calendar.svelte'; // Replace with your Svelte calendar component
    import Tooltip from '$lib/components/ui/tooltip.svelte'; // Replace with your Svelte tooltip component
  
    let date = parseDate(new Date().toISOString().split('T')[0]); // Use DateValue for compatibility
    let paymentsByDate = new Map();
  
    onMount(() => {
      // Sample data - replace with your actual data source
      const initialClients = [
        {
          id: 1,
          name: "Susan Alvarado",
          paymentFrequency: "Bi-Weekly",
          firstPayment: 150,
          regularPayment: 100,
          startDate: new Date("2024-01-15"),
          numberOfPayments: 13,
        },
        {
          id: 2,
          name: "James Wilson",
          paymentFrequency: "Bi-Weekly",
          firstPayment: 200,
          regularPayment: 150,
          startDate: new Date("2024-01-20"),
          numberOfPayments: 12,
        },
      ];
  
      // Generate payment schedule
      const payments = initialClients.flatMap((client) => {
        const schedule = [];
        let currentDate = new Date(client.startDate);
        const today = new Date();
  
        schedule.push({
          number: 1,
          date: new Date(currentDate),
          amount: client.firstPayment,
          status: "Paid",
          dueIn: null,
          clientId: client.id,
          clientName: client.name,
        });
  
        for (let i = 2; i <= client.numberOfPayments; i++) {
          currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000); // Add 14 days
          const dueInDays = Math.ceil(
            (currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          const status =
            dueInDays < 0 ? "Late" : dueInDays === 0 ? "Due Today" : "Pending";
  
          schedule.push({
            number: i,
            date: new Date(currentDate),
            amount: client.regularPayment,
            status,
            dueIn: dueInDays,
            clientId: client.id,
            clientName: client.name,
          });
        }
        return schedule;
      });
  
      // Group payments by date
      const paymentGroups = new Map();
      payments.forEach((payment) => {
        const dateKey = payment.date.toISOString().split('T')[0];
        if (!paymentGroups.has(dateKey)) {
          paymentGroups.set(dateKey, {
            count: 0,
            totalAmount: 0,
            payments: [],
          });
        }
        const group = paymentGroups.get(dateKey);
        group.count++;
        group.totalAmount += payment.amount;
        group.payments.push(payment);
      });
      paymentsByDate = paymentGroups;
    });
  
    function getDayContent(date: DateValue) {
      const dateKey = date.toString();
      const dayPayments = paymentsByDate.get(dateKey);
      const today = parseDate(new Date().toISOString().split('T')[0]);
      const isToday = date.compare(today) === 0;
  
      if (!dayPayments) {
        return `
          <div class="w-full h-full flex flex-col items-center p-2">
            <span class="text-base font-medium ${isToday ? 'text-blue-600' : ''}">
              ${date.day}
            </span>
          </div>
        `;
      }
  
      const hasOverdue = dayPayments.payments.some((p) => p.status === "Late");
      const hasDueToday = dayPayments.payments.some((p) => p.status === "Due Today");
      const bgColor = hasOverdue
        ? 'bg-red-50 hover:bg-red-100'
        : hasDueToday
        ? 'bg-yellow-50 hover:bg-yellow-100'
        : 'bg-blue-50 hover:bg-blue-100';
      const textColor = hasOverdue
        ? 'text-red-600'
        : hasDueToday
        ? 'text-yellow-600'
        : 'text-blue-600';
  
      return `
        <div class="w-full h-full flex flex-col p-2 cursor-pointer ${bgColor} transition-colors duration-150">
          <span class="text-base font-medium mb-2 ${textColor}">
            ${date.day}
          </span>
          <div class="flex flex-col items-center mt-auto space-y-1">
            <span class="text-sm font-medium ${textColor}">
              ${dayPayments.count} payment${dayPayments.count !== 1 ? 's' : ''}
            </span>
            <span class="text-sm text-muted-foreground">
              $${dayPayments.totalAmount}
            </span>
          </div>
        </div>
      `;
    }
  </script>
  
  <Card class="flex-1">
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <CalendarDays class="h-5 w-5 text-blue-600" />
        <span class="text-lg">Payment Schedule</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Calendar
        bind:value={date}
        showOutsideDays={true}
        class="w-full"
        dayContent={getDayContent}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          table: "w-full border-collapse border-spacing-0 border border-gray-200",
          row: "flex w-full border-b border-gray-200 last:border-0",
          head_row: "flex w-full border-b border-gray-200",
          head_cell: "w-full text-muted-foreground font-normal text-sm px-0 pt-0 pb-4 border-r border-gray-200 last:border-0",
          cell: "w-full min-h-[100px] relative p-0 text-center focus-within:relative focus-within:z-20 border-r border-gray-200 last:border-0",
          day: "w-full h-full hover:bg-accent hover:text-accent-foreground focus:z-20",
          day_range_start: "day-range-start",
          day_selected: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "opacity-50 pointer-events-none",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "day-range-middle",
          day_range_end: "day-range-end",
          nav: "flex items-center justify-between space-x-1 rtl:space-x-reverse",
          nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          caption: "relative flex w-full justify-center pt-1 pb-4 text-sm font-medium",
        }}
      />
    </CardContent>
  </Card>