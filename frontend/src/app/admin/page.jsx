"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";

const WelcomeAdmin = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 dark:bg-gray-800 p-4">

      <Card className="max-w-xl w-full shadow-lg rounded-2xl bg-white dark:bg-gray-900 dark:text-white">
        <CardContent className="text-center p-10">

          <Typography
            variant="h4"
            className="font-bold mb-4 text-gray-800 dark:text-white"
          >
            Welcome to Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            Manage users, products, and orders easily from the sidebar.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            className="px-6 py-2 rounded-lg"
          >
            Get Started
          </Button>

        </CardContent>
      </Card>

    </div>
  );
};

export default WelcomeAdmin;
