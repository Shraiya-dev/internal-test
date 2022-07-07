export const CTAMap = {
    RECEIVED: {
        actions: {
            view: true,
            edit: true,
            cancel: true,
            confirm: true,
            duplicate: true,
        },
    },
    CONFIRMED: {
        actions: {
            view: true,
            startAllocation: true,
            duplicate: true,
        },
    },
    ALLOCATION_PENDING: {
        actions: {
            view: true,
            duplicate: true,
        },
    },
    ALLOCATION_IN_PROGRESS: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            ACCEPTED: {
                jobCardActions: {
                    cancel: true,
                    rtd: true,
                },
            },
            READY_TO_DEPLOY: {
                addWorker: true,
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    // cancel: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {
                    accept: true,
                },
            },
        },
        actions: {
            view: true,
            jobCards: true,
            closeAllocation: true,
            duplicate: true,
        },
    },
    ALLOCATION_CLOSED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            ACCEPTED: {
                jobCardActions: {
                    cancel: true,
                    rtd: true,
                },
            },
            READY_TO_DEPLOY: {
                addWorker: true,
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    // cancel: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {
                    accept: true,
                },
            },
        },
        actions: {
            view: true,
            jobCards: true,
            deploy: true,
            duplicate: true,
        },
    },
    READY_TO_DEPLOY: {
        tabs: {
            READY_TO_DEPLOY: {
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },

        actions: {
            view: true,
            jobCards: true,
            deploy: true,
            duplicate: true,
        },
    },
    DEPLOYED: {
        tabs: {
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            view: true,
            attendance: true,
            startProject: false,
            duplicate: true,
            manageEmployees: true,
        },
    },
}
