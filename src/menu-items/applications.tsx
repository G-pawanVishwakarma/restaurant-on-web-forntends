// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { KyberNetwork, Messages2, Calendar1, Kanban, Profile2User, Bill, UserSquare, ShoppingBag } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ICONS
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'chat',
      title: <FormattedMessage id="chat" />,
      type: 'item',
      url: '/apps/chat',
      icon: icons.chat,
      breadcrumbs: false
    },
    {
      id: 'calendar',
      title: <FormattedMessage id="calendar" />,
      type: 'item',
      url: '/apps/calendar',
      icon: icons.calendar
    },
    {
      id: 'kanban',
      title: <FormattedMessage id="kanban" />,
      type: 'item',
      icon: icons.kanban,
      url: '/apps/kanban/board',
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: <FormattedMessage id="customer" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'customer-list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/customer/customer-list'
        },
        {
          id: 'customer-card',
          title: <FormattedMessage id="cards" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        }
      ]
    },
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      type: 'collapse',
      icon: icons.invoice,
      children: [
        {
          id: 'invoice-dashboard',
          title: <FormattedMessage id="dashboard" />,
          type: 'item',
          url: '/apps/invoice/dashboard',
          breadcrumbs: false
        },
        {
          id: 'invoice-create',
          title: <FormattedMessage id="create" />,
          type: 'item',
          url: '/apps/invoice/create',
          breadcrumbs: false
        },
        {
          id: 'invoice-details',
          title: <FormattedMessage id="details" />,
          type: 'item',
          url: '/apps/invoice/details/1',
          breadcrumbs: false
        },
        {
          id: 'invoice-list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/invoice/list',
          breadcrumbs: false
        },
        {
          id: 'invoice-edit',
          title: <FormattedMessage id="edit" />,
          type: 'item',
          url: '/apps/invoice/edit/1',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'collapse',
      icon: icons.profile,
      children: [
        {
          id: 'user-profile',
          title: <FormattedMessage id="user-profile" />,
          type: 'item',
          url: '/apps/profiles/user/personal',
          breadcrumbs: false
        },
        {
          id: 'account-profile',
          title: <FormattedMessage id="account-profile" />,
          type: 'item',
          url: '/apps/profiles/account/basic',
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'payment-method',
      title: <FormattedMessage id="payment-method" />,
      type: 'collapse',
      icon: icons.ecommerce,
      children: [
        {
          id: 'Payment-details',
          title: <FormattedMessage id="Payment-details" />,
          type: 'item',
          url: '/apps/payment-method/payment-details/1',
          breadcrumbs: false
        },
        {
          id: 'payment-list',
          title: <FormattedMessage id="payment-list" />,
          type: 'item',
          url: '/apps/payment-method/payment-list'
        },
        {
          id: 'add-new-payment',
          title: <FormattedMessage id="add-new-payment" />,
          type: 'item',
          url: '/apps/payment-method/add-new-payment'
        }
      ]
    },
    {
      id: 'Order-source',
      title: <FormattedMessage id="order-source" />,
      type: 'collapse',
      icon: icons.ecommerce,
      children: [
        {
          id: 'orderSource-list',
          title: <FormattedMessage id="orderSource-list" />,
          type: 'item',
          url: '/apps/order-source/orderSource-list'
        },
        {
          id: 'add-new-orderSource',
          title: <FormattedMessage id="add-new-orderSource" />,
          type: 'item',
          url: '/apps/order-source/add-new-orderSource'
        }
      ]
    }
  ]
};

export default applications;
