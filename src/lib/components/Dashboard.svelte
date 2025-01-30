<!-- src/lib/components/Dashboard.svelte -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { clients } from '$lib/stores';
    import type { Client, Payment } from '$lib/types';
    import { 
        AlertCircle, 
        Clock, 
        CalendarDays, 
        DollarSign,
        Users 
    } from 'lucide-svelte';
    import Card from '$lib/components/ui/card/card.svelte';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import CardTitle from '$lib/components/ui/card/card-title.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as Alert from '$lib/components/ui/alert';
    import * as ScrollArea from '$lib/components/ui/scroll-area';

    // let date = new;

    let allPayments: Payment[] = [];
    
    $: statCards = [
        { icon: Users, label: "Active Clients", value: stats.totalClients, color: "blue" },
        { icon: DollarSign, label: "Outstanding", value: `${stats.totalOutstanding}`, color: "green" },
        { icon: AlertCircle, label: "Overdue", value: stats.overduePayments, color: "red" },
        { icon: Clock, label: "Due This Week", value: stats.upcomingPayments, color: "yellow" },
        { icon: DollarSign, label: "Collected", value: `${stats.totalCollected}`, color: "blue" },
        { icon: DollarSign, label: "Collection Rate", value: `${stats.collectionRate}%`, color: "green" }
    ];
    let stats = {
        totalClients: 0,
        totalOutstanding: 0,
        overduePayments: 0,
        upcomingPayments: 0,
        totalCollected: 0,
        collectionRate: 0
    };
    let date = new Date();
    let paymentsByDate = new Map();

    function generatePaymentSchedule(client: Client): Payment[] {
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
            clientName: client.name
        });

        for (let i = 2; i <= client.numberOfPayments; i++) {
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            const dueInDays = Math.ceil(
                (new Date(currentDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            const status = dueInDays < 0 ? "Late" : dueInDays === 0 ? "Due Today" : "Pending";

            schedule.push({
                number: i,
                date: new Date(currentDate),
                amount: client.regularPayment,
                status,
                dueIn: dueInDays,
                clientId: client.id,
                clientName: client.name
            });
        }
        return schedule;
    }

    $: overduePayments = allPayments.filter(p => p.status === "Late");
    $: todayPayments = allPayments.filter(p => p.status === "Due Today");
    $: upcomingPayments = allPayments.filter(p => p.status !== "Paid" && p.dueIn !== null && p.dueIn > 0 && p.dueIn <= 7);

    onMount(() => {
        const unsubscribe = clients.subscribe(clientList => {
            if (!clientList) return;

            const payments = clientList.flatMap(client => generatePaymentSchedule(client));
            allPayments = payments;

            // Group payments by date
            const paymentGroups = new Map();
            payments.forEach(payment => {
                const dateKey = payment.date.toISOString().split('T')[0];
                if (!paymentGroups.has(dateKey)) {
                    paymentGroups.set(dateKey, {
                        count: 0,
                        totalAmount: 0,
                        payments: []
                    });
                }
                const group = paymentGroups.get(dateKey);
                group.count++;
                group.totalAmount += payment.amount;
                group.payments.push(payment);
            });
            paymentsByDate = paymentGroups;

            const overdueCount = payments.filter(p => p.status === "Late").length;
            const upcomingCount = payments.filter(p => p.dueIn !== null && p.dueIn >= 0 && p.dueIn <= 7).length;
            const outstandingAmount = payments
                .filter(p => p.status !== "Paid")
                .reduce((sum, p) => sum + p.amount, 0);
            
            stats = {
                totalClients: clientList.length,
                totalOutstanding: outstandingAmount,
                overduePayments: overdueCount,
                upcomingPayments: upcomingCount,
                totalCollected: 15000, // Placeholder value
                collectionRate: 85 // Placeholder value
            };
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="p-6 border-b bg-white">
        <h1 class="text-2xl font-bold">Credit Valee Dashboard</h1>
        <p class="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
    </header>

    <!-- Main 2x2 Grid Container -->
    <div class="flex-1 p-4">
        <div class="h-full grid grid-cols-2 grid-rows-2 gap-4">
            <!-- Top Left - Stats Cards -->
            <div class="space-y-4">
                <div class="bg-white rounded-lg p-4">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4">
                        <!-- Stats Cards -->
                        {#each statCards as stat}
                        <Card>
                            <CardContent class="p-4">
                                <div class="flex items-center space-x-2">
                                    <svelte:component this={stat.icon} class="h-4 w-4 text-{stat.color}-500" />
                                    <p class="text-xs font-medium">{stat.label}</p>
                                </div>
                                <p class="text-lg font-bold mt-1">{stat.value}</p>
                            </CardContent>
                        </Card>
                        {/each}
                    </div>
                </div>

                <!-- Action Required Section -->
                <div class="bg-white rounded-lg p-4">
                    <Card class="border-red-100">
                        <CardHeader>
                            <CardTitle class="flex items-center space-x-2">
                                <AlertCircle class="h-5 w-5 text-red-500" />
                                <span>Action Required</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea.Root class="h-48">
                                <Alert.Root variant="destructive">
                                    <Alert.Title>Overdue Payments</Alert.Title>
                                    <Alert.Description>
                                        <div class="mt-2 space-y-2">
                                            {#each overduePayments as payment (payment.clientId + '-' + payment.number)}
                                                <div class="flex justify-between items-center">
                                                    <span>{payment.clientName}</span>
                                                    <span class="font-semibold">
                                                        ${payment.amount} - {payment.dueIn !== null ? Math.abs(payment.dueIn) : 0} days overdue
                                                    </span>
                                                </div>
                                            {:else}
                                                <div class="text-center">No overdue payments</div>
                                            {/each}
                                        </div>
                                    </Alert.Description>
                                </Alert.Root>
                            </ScrollArea.Root>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <!-- Top Right - Upcoming Payments -->
            <div class="bg-white rounded-lg p-4">
                <Card class="h-full">
                    <CardHeader>
                        <CardTitle class="flex items-center space-x-2">
                            <CalendarDays class="h-5 w-5 text-blue-500" />
                            <span>Upcoming Payments</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs.Root value="today" class="w-full">
                            <Tabs.List>
                                <Tabs.Trigger value="today">Today</Tabs.Trigger>
                                <Tabs.Trigger value="upcoming">This Week</Tabs.Trigger>
                            </Tabs.List>
                            
                            <Tabs.Content value="today" class="mt-2">
                                <ScrollArea.Root class="h-[300px]">
                                    <div class="space-y-2">
                                        {#each todayPayments as payment (payment.clientId + '-' + payment.number)}
                                            <div class="flex justify-between items-center p-2 hover:bg-muted rounded-lg">
                                                <div>
                                                    <div>{payment.clientName}</div>
                                                    <div class="text-sm text-muted-foreground">
                                                        {payment.phoneNumber || 'No contact info'}
                                                    </div>
                                                </div>
                                                <span>${payment.amount}</span>
                                            </div>
                                        {:else}
                                            <div class="text-center p-2 text-muted-foreground text-sm">
                                                No payments due today
                                            </div>
                                        {/each}
                                    </div>
                                </ScrollArea.Root>
                            </Tabs.Content>
                            
                            <Tabs.Content value="upcoming" class="mt-2">
                                <ScrollArea.Root class="h-[300px]">
                                    <div class="space-y-2">
                                        {#each upcomingPayments as payment (payment.clientId + '-' + payment.number)}
                                            <div class="flex justify-between items-center p-2 hover:bg-muted rounded-lg">
                                                <div>
                                                    <div>{payment.clientName}</div>
                                                    <div class="text-sm text-muted-foreground">
                                                        Due in {payment.dueIn} days
                                                    </div>
                                                </div>
                                                <span>${payment.amount}</span>
                                            </div>
                                        {:else}
                                            <div class="text-center p-2 text-muted-foreground text-sm">
                                                No upcoming payments this week
                                            </div>
                                        {/each}
                                    </div>
                                </ScrollArea.Root>
                            </Tabs.Content>
                        </Tabs.Root>
                    </CardContent>
                </Card>
            </div>

            <!-- Bottom Calendar - Spans both columns -->
            <div class="col-span-2 bg-white rounded-lg p-4">
                <Card class="h-full">
                    <CardHeader class="pb-2 flex flex-row justify-between items-center">
                        <CardTitle class="flex items-center space-x-2">
                            <CalendarDays class="h-5 w-5 text-blue-500" />
                            <span class="text-lg">Payment Schedule</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex justify-center">
                            <!-- Calendar placeholder - to be replaced with custom component -->
                            <div class="w-full border rounded-md p-3 text-center">
                                Calendar Component Placeholder
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</div>