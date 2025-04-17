
// src/components/ShowsSection/ShowsSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
  ticketLink?: string;
  isSoldOut?: boolean;
  isAnnounced?: boolean;
}

const ShowsSection = () => {
  // Shows data
  // For upcoming shows, we'll include actual shows
  // For past shows, add some example past shows
  const upcomingShows: Show[] = [
    {
      id: '1',
      date: 'Apr 30, 2025',
      venue: 'Spatial Sound Lab',
      location: 'Los Angeles, CA',
      ticketLink: 'https://tickets.example.com/arcova-la',
    },
    {
      id: '2',
      date: 'May 15, 2025',
      venue: 'The Echo Chamber',
      location: 'San Francisco, CA',
      ticketLink: 'https://tickets.example.com/arcova-sf',
    },
    {
      id: '3',
      date: 'June 11, 2025',
      venue: 'Digital Dreams Festival',
      location: 'New York, NY',
      isAnnounced: false,
    },
    {
      id: '4',
      date: 'July 22, 2025',
      venue: 'The Deep End',
      location: 'Austin, TX',
      isSoldOut: true,
    },
  ];

  const pastShows: Show[] = [
    {
      id: '5',
      date: 'Feb 18, 2025',
      venue: 'Signal Flow Gallery',
      location: 'Portland, OR',
    },
    {
      id: '6',
      date: 'Jan 25, 2025',
      venue: 'Data Dome',
      location: 'Seattle, WA',
    },
    {
      id: '7',
      date: 'Dec 15, 2024',
      venue: 'The Interface',
      location: 'Chicago, IL',
    },
  ];

  // Tab state for upcoming and past shows
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6">SHOWS</h2>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium text-sm tracking-wider transition-colors ${
            activeTab === 'upcoming'
              ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          UPCOMING
        </button>
        
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 font-medium text-sm tracking-wider transition-colors ${
            activeTab === 'past'
              ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          PAST
        </button>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingShows.length > 0 ? (
                upcomingShows.map((show) => (
                  <motion.div 
                    key={show.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                    whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                      <div className="text-lg font-medium">{show.date}</div>
                      <div className="md:col-span-2">
                        <div className="font-medium">{show.venue}</div>
                        <div className="text-sm text-gray-500">{show.location}</div>
                      </div>
                      <div className="flex justify-end">
                        {show.isAnnounced === false ? (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                            Coming Soon
                          </span>
                        ) : show.isSoldOut ? (
                          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                            Sold Out
                          </span>
                        ) : (
                          <motion.a
                            href={show.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary-DEFAULT text-white text-sm px-4 py-2 rounded-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Tickets
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No upcoming shows at the moment.</p>
                  <p className="mt-2 text-sm text-gray-500">Check back soon for new announcements.</p>
                </div>
              )}
              
              {/* Call to action for booking */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">Want to book ARCOVA for your venue or event?</p>
                <motion.button
                  onClick={() => {
                    // Navigate to contact section
                    const contactLink = document.querySelector('button:contains("Contact")');
                    if (contactLink) {
                      (contactLink as HTMLButtonElement).click();
                    }
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-accent-light to-accent-DEFAULT text-white rounded-md text-sm tracking-wider"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  CONTACT FOR BOOKING
                </motion.button>
              </div>
            </div>
          )}
          
          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastShows.length > 0 ? (
                pastShows.map((show) => (
                  <motion.div 
                    key={show.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 opacity-80"
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                      <div className="text-lg font-medium">{show.date}</div>
                      <div className="md:col-span-2">
                        <div className="font-medium">{show.venue}</div>
                        <div className="text-sm text-gray-500">{show.location}</div>
                      </div>
                      <div className="flex justify-end">
                        <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          Past Event
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No past shows to display.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Newsletter Signup for Show Updates */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">Never Miss a Show</h3>
        <p className="text-sm text-gray-600 mb-4">
          Subscribe to get notified about upcoming performances and ticket releases.
        </p>
        
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
            required
          />
          <motion.button
            type="submit"
            className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md font-medium whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            SUBSCRIBE
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ShowsSection;