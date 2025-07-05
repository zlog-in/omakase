import toast from 'react-hot-toast'

// 扩展 toast 功能，确保类型安全
export const customToast = {
    success: (message: string, options?: any) => {
        return toast.success(message, options)
    },

    error: (message: string, options?: any) => {
        return toast.error(message, options)
    },

    loading: (message: string, options?: any) => {
        return toast.loading(message, options)
    },

    info: (message: string, options?: any) => {
        return toast(message, {
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: '#ffffff',
            },
            ...options
        })
    },

    warning: (message: string, options?: any) => {
        return toast(message, {
            icon: '⚠️',
            style: {
                background: '#f59e0b',
                color: '#ffffff',
            },
            ...options
        })
    },

    // 质押相关的特定toast
    staking: {
        stakeSuccess: (message: string = 'Stake successful!') => {
            return toast.success(message, {
                icon: '⚡',
                duration: 4000,
            })
        },

        unstakeSuccess: (lockPeriod: number) => {
            return toast.success(`Unstake successful! You can withdraw after ${lockPeriod} seconds lock period.`, {
                icon: '🕐',
                duration: 5000,
            })
        },

        withdrawSuccess: () => {
            return toast.success('Withdraw successful! Your tokens have been returned.', {
                icon: '💰',
                duration: 4000,
            })
        },

        claimSuccess: (amount: string) => {
            return toast.success(`Reward claim successful! ${amount} USDC will be sent to your wallet.`, {
                icon: '🎉',
                duration: 5000,
            })
        },

        approvalSuccess: () => {
            return toast.success('Token approval successful', {
                icon: '✅',
                duration: 3000,
            })
        },

        unstakeCancelWarning: () => {
            return toast('Staking will cancel your previous unstake request', {
                icon: 'ℹ️',
                style: {
                    background: '#3b82f6',
                    color: '#ffffff',
                },
                duration: 4000,
            })
        },

        statusChange: {
            active: (wasCancelled: boolean = false) => {
                const message = wasCancelled
                    ? 'Unstake cancelled! You are now actively staking again.'
                    : 'You are now actively staking!'
                return toast.success(message, {
                    icon: '⚡',
                    duration: 4000,
                })
            },

            unstaked: () => {
                return toast('Unstake initiated. You can withdraw after the lock period.', {
                    icon: 'ℹ️',
                    style: {
                        background: '#3b82f6',
                        color: '#ffffff',
                    },
                    duration: 4000,
                })
            },

            withdrawn: () => {
                return toast.success('Withdrawal completed!', {
                    icon: '💰',
                    duration: 4000,
                })
            }
        }
    }
}

// 默认导出原始toast以保持兼容性
export default toast