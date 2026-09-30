async function runTests() {
  console.log('--- STARTING EVENTPULSE INTEGRATION TESTS ---');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'online' ? '✅ PASSED' : '❌ FAILED', health);

  // 2. Organizer Login
  const orgLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'organizer@eventpulse.com', password: 'password123' })
  });
  const orgLogin = await orgLoginRes.json();
  console.log('2. Organizer Login:', orgLogin.success ? '✅ PASSED' : '❌ FAILED', {
    name: orgLogin.user?.name,
    role: orgLogin.user?.role
  });

  // 3. Attendee Login
  const attLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'attendee@eventpulse.com', password: 'password123' })
  });
  const attLogin = await attLoginRes.json();
  console.log('3. Attendee Login:', attLogin.success ? '✅ PASSED' : '❌ FAILED', {
    name: attLogin.user?.name,
    role: attLogin.user?.role
  });

  // 4. Fetch Events list
  const eventsRes = await fetch('http://localhost:5000/api/events');
  const events = await eventsRes.json();
  console.log('4. Fetch Events List:', events.success && events.count > 0 ? '✅ PASSED' : '❌ FAILED', `Count: ${events.count}`);

  // 5. Fetch Attendee Registrations
  const myBookingsRes = await fetch('http://localhost:5000/api/registrations/my', {
    headers: { Authorization: `Bearer ${attLogin.token}` }
  });
  const myBookings = await myBookingsRes.json();
  console.log('5. Fetch Attendee Registrations:', myBookings.success ? '✅ PASSED' : '❌ FAILED', {
    bookingsCount: myBookings.count,
    ticketCode: myBookings.data[0]?.ticketCode,
    eventTitle: myBookings.data[0]?.event?.title
  });

  // 6. Test Frontend UI response
  const frontendRes = await fetch('http://localhost:5173');
  console.log('6. Frontend Vite Server:', frontendRes.status === 200 ? '✅ PASSED' : '❌ FAILED', `HTTP ${frontendRes.status}`);

  // 7. Organizer Dashboard Stats
  const statsRes = await fetch('http://localhost:5000/api/events/my/organized', {
    headers: { Authorization: `Bearer ${orgLogin.token}` }
  });
  const stats = await statsRes.json();
  console.log('7. Organizer Dashboard API:', stats.success ? '✅ PASSED' : '❌ FAILED', stats.stats);

  console.log('--- ALL INTEGRATION TESTS COMPLETE ---');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
